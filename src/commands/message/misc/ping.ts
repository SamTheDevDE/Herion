import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, MessageFlags } from 'discord.js';
import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";

export default class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Shows the bot latency',
            category: "miscellaneous",
            aliases: ['pong'],
            cooldown: 2,
            args: { required: false },
            guildOnly: { enabled: false }
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const message = options.message;
        // Use Date.now() for more accurate latency measurement
        const start = Date.now();
        const sent = await message.reply('Pinging...');
        const latency = Date.now() - start;

        const refreshBtn = new ButtonBuilder()
            .setCustomId("ping_refresh_btn")
            .setEmoji("🔄")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Refresh")

        let wsPing = message.client.ws.ping;
        const wsPingDisplay = wsPing === -1 ? 'N/A' : `**${wsPing}ms**`;
        const pingContainer = new ContainerBuilder()
            .addTextDisplayComponents(td => td.setContent(
                `🏓 **Pong!**\n` +
                `Message Latency: **${latency}ms**\n` +
                `WebSocket Ping: ${wsPingDisplay}`
            ))
            .addActionRowComponents(ar => ar.addComponents(refreshBtn))
            .setAccentColor(Colors.DarkGreen);

        await sent.edit({
            content: '',
            components: [pingContainer],
            flags: MessageFlags.IsComponentsV2
        });
    }
}