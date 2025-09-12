import { ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, ContainerBuilder, MessageFlags } from 'discord.js';
import { ButtonOptions } from "../../types/interaction";

const handler: ButtonOptions = {
  customId: "ping_refresh_btn",
  async execute(interaction: ButtonInteraction, args: string[]) {

    // Step 1: Edit the message to 'Pinging...' using componentsV2
    const start = Date.now();
    const pingingContainer = new ContainerBuilder()
      .addTextDisplayComponents(td => td.setContent('⏳ Pinging...'))
      .setAccentColor(Colors.Yellow);
    await interaction.update({
      components: [pingingContainer],
      flags: MessageFlags.IsComponentsV2
    });

    // Step 2: Wait a tick to ensure the edit is processed
    await new Promise(res => setTimeout(res, 10));
    const latency = Date.now() - start;

    const refreshBtn = new ButtonBuilder()
      .setCustomId("ping_refresh_btn")
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Refresh");

    let wsPing = interaction.client.ws.ping;
    const wsPingDisplay = wsPing === -1 ? 'N/A' : `**${wsPing}ms**`;

    const pingContainer = new ContainerBuilder()
      .addTextDisplayComponents(td => td.setContent(
        `🏓 **Pong!**\n` +
        `Message Latency: **${latency}ms**\n` +
        `WebSocket Ping: ${wsPingDisplay}`
      ))
      .addActionRowComponents(ar => ar.addComponents(refreshBtn))
      .setAccentColor(Colors.DarkGreen);

    // Step 3: Edit the message again with the result (must use editReply)
      await interaction.editReply({
        components: [pingContainer],
        flags: MessageFlags.IsComponentsV2
      });
  }
};

export default handler;
