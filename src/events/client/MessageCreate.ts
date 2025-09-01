import { Events, Message } from "discord.js";
import config from "../../config";
import { ExtendedClient } from "../../client";

export default {
    name: Events.MessageCreate,
    async execute(message: Message, client: ExtendedClient) {
        if (message.author.bot) return;
        if (!message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = client.messageCommands.get(commandName);

        if (!command) return;

        // Check for owner-only commands
        if (command.ownerOnly && !config.ownerIds.includes(message.author.id)) {
            return message.reply('This command can only be used by the bot owner!');
        }

        try {
            await command.execute({ message, args });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command!');
        }
    }
};