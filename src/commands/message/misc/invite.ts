import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, MessageFlags } from "discord.js";
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
        const inviteBtn = new ButtonBuilder()
            .setLabel("Invite me here! :3")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/oauth2/authorize?client_id=${message.client.user.id}`)

        const inviteContainer = new ContainerBuilder()
            .setAccentColor(Colors.Aqua)
            .addTextDisplayComponents(td => td.setContent(
                `✨ **Invite ${message.client.user.username} to your server!** ✨\n\n` +
                `Thank you for considering adding me to your community.\n` +
                `Click the button below to invite me and unlock awesome features, moderation, and fun commands!\n\n` +
                `If you have any questions or need support, feel free to reach out!`
            ))
            .addActionRowComponents(row => row.setComponents(inviteBtn))

        message.reply({
            components: [inviteContainer],
            flags: MessageFlags.IsComponentsV2
        })
    }
}