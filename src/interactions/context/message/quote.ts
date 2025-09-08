import { MessageContextMenuCommandInteraction } from "discord.js";
import { MessageContextOptions } from "../../../types/interaction";

const handler: MessageContextOptions = {
  name: "Quote Message",
  async execute(interaction: MessageContextMenuCommandInteraction) {
    const msg = interaction.targetMessage;
    await interaction.reply({ content: `Quoted: "${msg.content}" by <@${msg.author.id}>`, ephemeral: true });
  }
};

export default handler;
