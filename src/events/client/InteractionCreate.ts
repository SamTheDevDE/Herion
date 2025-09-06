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
        const Command = client.slashCommands.get(name);
        // defines command to be either the devCommand or Command
        const command = devCommand ?? Command;

        // if it isn't a command stop here
        if (!command) return;

        // gets the ids in the config of the owners
        const ownerIds = client.config.get('ownerIds') as string[];
        // checks if the command is owner only and if the interaction user is in the owner list
        if (command.ownerOnly && !ownerIds?.includes(interaction.user.id)) {
            return interaction.reply({ 
                content: 'This command can only be used by the bot owner!',
                ephemeral: true 
            });
        }

        // if nothing went wrong try executing the command
        try {
            await command.execute({
                interaction: interaction as ChatInputCommandInteraction,
                client
            });
        } catch (error) {
            // if an error occurs log the error and send an reply saying that an error happened
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