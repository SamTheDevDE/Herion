import { Events, Message } from "discord.js";
import config from "../../config";
import { ExtendedClient } from "../../client";
import Logger from "../../classes/Logger";

const log = Logger.getInstance()

export default {
    name: Events.MessageCreate,
    async execute(message: Message, client: ExtendedClient) {
        // check if the message author is a bot if yes don't do anything
        if (message.author.bot) return;
        // check if the message content starts with the prefix in the config if no don't do anything
        // will probably get changed when introducing "message tags" or triggers idk how to name that yet
        if (!message.content.startsWith(config.prefix)) return;
        // gets everything after the prefix and put it as args
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        // gets the initial command name
        const commandName = args.shift()?.toLowerCase();
        // if there is for some reason no command name don't do anything
        if (!commandName) return;
        // searches for the command name in all message commands
        const command = client.messageCommands.get(commandName);
        // if STILL there isn't anything, don't do anything
        if (!command) return;
        // check if the command is owner only if yes and the message author is not a owner say a message and don't do anything else
        if (command.ownerOnly && !config.ownerIds.includes(message.author.id)) {
            return message.reply('This command can only be used by the bot owner!');
        }
        // if after ALL of that there isn't any issues then execute the command
        try {
            await command.execute({
                message, args,
                client: new ExtendedClient
            });
        } catch (error) {
            // if there in fact is an error log the error and send a message saying that an error happened
            log.error(error as string);
            message.reply('There was an error executing that command!');
        }
    }
};