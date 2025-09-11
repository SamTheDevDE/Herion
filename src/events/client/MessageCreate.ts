import { ChannelType, Collection, Events, Message } from "discord.js";
import config from "../../config";
import { ExtendedClient } from "../../client";
import Logger from "../../classes/Logger";

const log = Logger.getInstance();

export default {
    name: Events.MessageCreate,
    async execute(message: Message, client: ExtendedClient) {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Ignore messages that don't start with the configured prefix
        if (!message.content.startsWith(config.prefix)) return;

        // Parse command name and arguments
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        // Find the command by name
        const command = client.messageCommands.get(commandName);
        if (!command) return;

        // Owner only check
        if (command.ownerOnly && !config.ownerIds.includes(message.author.id)) {
            return message.reply('This command can only be used by the bot owner!');
        }

        // Guild only checks
        if (command.guildOnly?.enabled) {
            if (message.channel.type === ChannelType.DM) {
                return message.reply("This command can only be used in a server.");
            }
            if (command.guildOnly.whitelist && command.guildOnly.whitelist.length > 0) {
                if (!command.guildOnly.whitelist.includes(message.guild?.id ?? "")) {
                    return;
                }
            }
            if (command.guildOnly.blacklist && command.guildOnly.blacklist.length > 0) {
                if (command.guildOnly.blacklist.includes(message.guild?.id ?? "")) {
                    return;
                }
            }
        }

        // Cooldown handling
        const { cooldowns } = client;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps?.has(message.author.id)) {
            const previousTimestamp = timestamps.get(message.author.id);
            if (previousTimestamp !== undefined) {
                const expirationTime = previousTimestamp + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply({
                        content: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`,
                    });
                }
            }
        }
        timestamps?.set(message.author.id, now);
        setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);

        // Argument requirement check
        if (command.args?.required && args.length === 0) {
            return message.reply({
                content: `You forgot to include the required arguments${command.args.argList && command.args.argList.length > 0 ? `: ${command.args.argList.join(", ")}` : ""}`
            });
        }

        // Permission checks
        if (command.permissions && message.channel.type !== ChannelType.DM) {
            if ("permissionsFor" in message.channel && typeof message.channel.permissionsFor === "function") {
                // User permissions
                if (command.permissions.user && command.permissions.user.length > 0) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !authorPerms.has(command.permissions.user)) {
                        return message.reply({ content: "You do not have permission to use this command!" });
                    }
                }
                // Bot permissions
                if (command.permissions.bot && command.permissions.bot.length > 0) {
                    const botMember = message.guild?.members.me;
                    if (!botMember) {
                        return message.reply({ content: "Could not check bot permissions." });
                    }
                    const botPerms = message.channel.permissionsFor(botMember);
                    if (!botPerms || !botPerms.has(command.permissions.bot)) {
                        return message.reply({ content: "I do not have permission to execute this command!" });
                    }
                }
            } else {
                return message.reply({ content: "Cannot check permissions in this channel type." });
            }
        }

        // Execute the command
        try {
            await command.execute({
                message,
                args,
                client
            });
        } catch (error) {
            log.error(error as string);
            message.reply('There was an error executing that command!');
        }
    }
};