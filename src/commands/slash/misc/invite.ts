import { ExtendedSlashCommandBuilder, SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";

export default class InviteSlashCommand extends SlashCommand {
    constructor() {
        const data = new ExtendedSlashCommandBuilder()
            .setName('invite')
            .setDescription('gets you the invite of the bot.')
            
        super(data);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction = options.interaction;
        // replies with the install link
        interaction.reply({ content: `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}`, flags: 64 })
    }
}