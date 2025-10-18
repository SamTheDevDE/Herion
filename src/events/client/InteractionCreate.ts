import { Events, Interaction, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { ExtendedClient } from "../../client"
import Logger from "../../classes/Logger"

const log = Logger.getInstance()

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction, client: ExtendedClient) {
        try {
            // Slash commands (no args)
            if (interaction.isChatInputCommand()) {
                const chat = interaction as ChatInputCommandInteraction;
                const name = chat.commandName;
                const devCommand = client.devSlashCommands.get(name);
                const Command = client.slashCommands.get(name);
                const command = devCommand ?? Command;
                if (!command) return;

                const ownerIds = client.config.get('ownerIds') as string[];
                if (command.ownerOnly && !ownerIds?.includes(interaction.user.id)) {
                    return interaction.reply({ content: 'This command can only be used by the bot owner!', flags: MessageFlags.Ephemeral });
                }
                await command.execute({ interaction: chat, client });
                return;
            }

            // Button interactions
            if (interaction.isButton()) {
                // customId: "handler:arg1:arg2"
                const [id, ...args] = interaction.customId.split(":");
                const handler = client.buttons.get(id);
                if (!handler) return;
                await handler.execute(interaction, args);
                return;
            }

            // Modal submit
            if (interaction.isModalSubmit()) {
                const [id, ...args] = interaction.customId.split(":");
                const handler = client.modals.get(id);
                if (!handler) return;
                await handler.execute(interaction, args);
                return;
            }

            // Select menus (String select)
            if (interaction.isStringSelectMenu()) {
                const [id, ...args] = interaction.customId.split(":");
                const handler = client.selectMenus.get(id);
                if (!handler) return;
                await handler.execute(interaction, args);
                return;
            }

            // Autocomplete (no customId, but you can parse from focused value if needed)
            if (interaction.isAutocomplete()) {
                // Optionally parse args from focused value
                const focused = interaction.options.getFocused(true);
                const args = focused.value ? [focused.value] : [];
                const handler = client.autoCompletes.get(interaction.commandName);
                if (!handler) return;
                await handler.execute(interaction, args);
                return;
            }

            // Context menus (no args by default, but could be extended)
            if (interaction.isMessageContextMenuCommand()) {
                const handler = client.messageContexts.get(interaction.commandName);
                if (!handler) return;
                await handler.execute(interaction, []);
                return;
            }
            if (interaction.isUserContextMenuCommand()) {
                const handler = client.userContexts.get(interaction.commandName);
                if (!handler) return;
                await handler.execute(interaction, []);
                return;
            }
        } catch (error) {
            log.error(error as string);
            try {
                if (interaction.isRepliable()) {
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'There was an error handling this interaction.', flags: MessageFlags.Ephemeral });
                    } else {
                        await interaction.reply({ content: 'There was an error handling this interaction.', flags: MessageFlags.Ephemeral });
                    }
                }
            } catch { /* not yet */ }
        }
    }
};