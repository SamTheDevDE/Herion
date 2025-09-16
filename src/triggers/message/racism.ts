import { Message, ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, MessageFlags } from "discord.js";
import { ExtendedClient } from "../../client";
import { MessageTriggerFile } from "../../types/trigger";

const trigger: MessageTriggerFile = {
  key: ["racism", "racist"],
  caseSensitive: true,
  async execute(message: Message, _client: ExtendedClient) {
    const btn1 = new ButtonBuilder()
      .setCustomId("trigger_btn_1")
      .setEmoji("☑️")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);
    const btn2 = new ButtonBuilder()
      .setCustomId("trigger_btn_2")
      .setEmoji("🇽")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger);
    const container = new ContainerBuilder()
      .setAccentColor(Colors.Aqua)
      .addTextDisplayComponents(td => td.setContent("Are you racist?"))
      .addActionRowComponents(ar => ar.addComponents([btn1, btn2]));
    await message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
  },
};

export default trigger;
