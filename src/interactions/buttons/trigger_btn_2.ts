import { ButtonInteraction } from "discord.js";
import { ButtonOptions } from "../../types/interaction";

const handler: ButtonOptions = {
  customId: "trigger_btn_2",
  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.reply({ content: `${interaction.user.displayName} pressed no. Good!` });
  }
};

export default handler;
