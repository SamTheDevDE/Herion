import { TextChannel } from "discord.js";
import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";

export default class InviteCommand extends Command {
    constructor() {
        super({
            name: 'clear',
            description: 'clears a certain amount of messages in the current channel.',
            category: "moderation",
            permissions: {
                user: ["ManageMessages"],
                bot: ["ManageMessages"]
            },
            aliases: ["cc"],
            cooldown: 5,
            args: {
                required: true,
                argList: ["amount of messages"]
            },
            guildOnly: { 
                enabled: true,
                whitelist: [],
                blacklist: []
            }
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const { message, args } = options;
        if (!(message.channel instanceof TextChannel)) {
            return message.reply("This command can only be used in text channels.");
        }
        const channel = message.channel as TextChannel;
        // Check if the amount argument is provided and is a number
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply("Please provide a number between 1 and 100.");
        }

        // Bulk delete messages
        try {
            await message.delete(); // Delete the command message itself
            const deleted = await channel.bulkDelete(amount, true);
            channel.send(`🗑️ Deleted ${deleted.size} message(s).`).then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 3000);
            });
        } catch (err) {
            channel.send("Failed to delete messages. Do I have the correct permissions?");
        }
    }
}