import { readdirSync, statSync } from "fs";
import { join, extname } from "path";
import Logger from "../classes/Logger";
import { ExtendedClient } from "../client";

const log = Logger.getInstance();

// types of files to load
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

// a function to get every file from a folder
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

// a function to load every file using the directory the load type (aka type of file) and the bot client
export async function loadFiles(directory: string, loadType: LoadAbles, client: ExtendedClient) {
    const files = getFilesRecursive(directory);
    for (const file of files) {
        // loops thru every file in the list "files"
        try {
            const imported = await import(file);
            const module = imported.default || imported;
            
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
                            client.once(module.name, (...args) => module.execute(...args, client));
                        } else {
                            client.on(module.name, (...args) => module.execute(...args, client));
                        }
                        client.clientEvents.set(module.name, module);
                        log.debug(`[ClientEvent] Loaded: ${module.name}`);
                    }
                    break
                case LoadAbles.MessageCommands:
                    if (module.prototype?.execute && module.prototype?.constructor) {
                        const command = new module();
                        client.messageCommands.set(command.name, command);
                        command.aliases?.forEach((alias: string) => {
                            client.messageCommands.set(alias, command);
                        });
                        log.debug(`[MessageCommand] Loaded: ${command.name}`);
                    }
                    break;
                case LoadAbles.SlashCommands:
                    if (module.prototype?.execute && module.prototype?.constructor) {
                        try {
                            const command = new module();
                            if (!command.data?.name) {
                                log.error(`[SlashCommand] Missing data or name property in ${file}`);
                                break;
                            }
                            if (command.data?.ownerOnly == true) {
                                client.devSlashCommands.set(command.data.name, command);
                                log.debug(`[DevSlashCommand] Loaded: ${command.data.name}`);
                            } else {
                                client.slashCommands.set(command.data.name, command);
                                log.debug(`[SlashCommand] Loaded: ${command.data.name}`);
                            }
                        } catch (error) {
                            log.error(`[SlashCommand] Failed to load ${file}:`, error);
                        }
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
                        client.messageContexts.set(module.name, module)
                        log.debug(`[MessageInteraction] Loaded: ${module.name}`)
                    }
                    break
                case LoadAbles.UserInteractions:
                    if (module.name && typeof module.execute === "function") {
                        client.userContexts.set(module.name, module)
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