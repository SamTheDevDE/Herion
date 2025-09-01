import { readdirSync, statSync } from "fs";
import { join, extname } from "path";
import Logger from "../classes/Logger";
import { ExtendedClient } from "../client";

const log = Logger.getInstance();

export enum LoadAbles {
    GuildEvents,
    ClientEvents,
    MessageCommands,
    SlashCommands,
    Buttons,
    Modals,
    MessageInteractions,
    UserInteractions,
    AutoCompletes,
    SelectMenus
}

function getFilesRecursive(dir: string): string[] {
    let results: string[] = []
    const list = readdirSync(dir)
    for (const file of list) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursive(filePath))
        } else if (extname(filePath).match(/\.(ts|js)$/)) {
            results.push(filePath)
        }
    }
    return results
}

export async function loadFiles(directory: string, loadType: LoadAbles, client: ExtendedClient) {
    const files = getFilesRecursive(directory)
    for (const file of files) {
        try {
            const imported = await import(file)
            const module = imported.default || imported
            switch (loadType) {
                case LoadAbles.GuildEvents:
                    if (module.name && typeof module.execute === "function") {
                        client.on(module.name, (...args) => module.execute(...args, client))
                        log.debug(`[GuildEvent] Loaded: ${module.name}`)
                    }
                    break
                case LoadAbles.ClientEvents:
                    if (module.name && typeof module.execute === "function") {
                        if (module.once) {
                            client.once(module.name, (...args) => module.execute(...args, client))
                        } else {
                            client.on(module.name, (...args) => module.execute(...args, client))
                        }
                        client.clientEvents.set(module.name, module)
                        log.debug(`[ClientEvent] Loaded: ${module.name}`)
                    }
                    break
                case LoadAbles.MessageCommands:
                    if (module.name && typeof module.execute === "function") {
                        if (module.once) {
                            client.once(module.name, (...args) => module.execute(...args, client))
                        } else {
                            client.on(module.name, (...args) => module.execute(...args, client))
                        }
                        client.guildEvents.set(module.name, module)
                        log.debug(`[GuildEvent] Loaded: ${module.name}`)
                    }
                    break
                case LoadAbles.SlashCommands:
                    if (module.data?.name && typeof module.execute === "function") {
                        client.slashCommands.set(module.data.name, module)
                        log.debug(`[SlashCommand] Loaded: ${module.data.name}`)
                    }
                    break
                case LoadAbles.Buttons:
                    if (module.customId && typeof module.execute === "function") {
                        client.buttons.set(module.customId, module)
                        log.debug(`[Button] Loaded: ${module.customId}`)
                    }
                    break
                case LoadAbles.Modals:
                    if (module.customId && typeof module.execute === "function") {
                        client.modals.set(module.customId, module)
                        log.debug(`[Modal] Loaded: ${module.customId}`)
                    }
                    break
                case LoadAbles.MessageInteractions:
                    if (module.name && typeof module.execute === "function") {
                        log.debug(`[MessageInteraction] Loaded: ${module.name}`)
                    }
                    break
                case LoadAbles.UserInteractions:
                    if (module.name && typeof module.execute === "function") {
                        log.debug(`[UserInteraction] Loaded: ${module.name}`)
                    }
                    break
                case LoadAbles.AutoCompletes:
                    if (module.commandName && typeof module.execute === "function") {
                        client.autoCompletes.set(module.commandName, module)
                        log.debug(`[AutoComplete] Loaded: ${module.commandName}`)
                    }
                    break
                case LoadAbles.SelectMenus:
                    if (module.customId && typeof module.execute === "function") {
                        client.selectMenus.set(module.customId, module)
                        log.debug(`[SelectMenu] Loaded: ${module.customId}`)
                    }
                    break
                default:
                    log.debug(`[Unknown] Skipped: ${file}`)
            }
        } catch (err) {
            log.error(`❌ Failed to load file ${file}:`, err)
        }
    }
}