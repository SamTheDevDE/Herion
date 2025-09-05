import { Events, Interaction, ChatInputCommandInteraction } from "discord.js"
import { ExtendedClient } from "../../client"
import Logger from "../../classes/Logger"

const log = Logger.getInstance()

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction, client: ExtendedClient) {
        if (!interaction.isChatInputCommand()) return;
        const chat = interaction as ChatInputCommandInteraction;
        const name = chat.commandName;

        const devCommand = client.devSlashCommands.get(name);
        const prodCommand = client.slashCommands.get(name);
        const command = devCommand ?? prodCommand;

        if (!command) return;

        const ownerIds = client.config.get('ownerIds') as string[];
        if (command.ownerOnly && !ownerIds?.includes(interaction.user.id)) {
            return interaction.reply({ 
                content: 'This command can only be used by the bot owner!',
                ephemeral: true 
            });
        }

        try {
            await command.execute({
                interaction: interaction as ChatInputCommandInteraction,
                client
            });
        } catch (error) {
            log.error(error as string);
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ 
                    content: 'There was an error executing this command!',
                    ephemeral: true 
                });
            } else {
                await interaction.reply({ 
                    content: 'There was an error executing this command!',
                    flags: 64 
                });
            }
        }
    }
};