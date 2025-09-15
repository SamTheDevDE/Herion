import { ButtonInteraction } from "discord.js";
import { ButtonOptions } from "../../types/interaction";

const handler: ButtonOptions = {
  customId: "trigger_btn_1",
  async execute(interaction: ButtonInteraction, args: string[]) {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) {
      await interaction.reply({ content: `Could not find member.` });
      return;
    }
    if (member.bannable) {
      await member.ban({ reason: "Racism is not allowed.", deleteMessageSeconds: 604800 });
      await interaction.reply({ content: `${member.displayName} pressed yes and was banned.` });
    } else {
      await interaction.reply({ content: `${member.displayName} pressed yes. you make me sick.` });
    }
  }
};

export default handler;
