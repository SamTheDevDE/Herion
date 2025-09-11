import { ExtendedClient } from "../../../client";
import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";

export default class InviteCommand extends Command {
    constructor() {
        super({
            name: 'invite',
            description: 'Gets you the invite of the bot.',
            aliases: ["install"],
            category: "miscellaneous",
            cooldown: 3
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const message = options.message;
        // replies with the install link
        message.reply(`https://discord.com/oauth2/authorize?client_id=${message.client.user.id}`)
    }
}