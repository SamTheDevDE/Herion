import { ButtonInteraction } from "discord.js";
import { ButtonOptions } from "../../types/interaction";

const handler: ButtonOptions = {
  customId: "example_button",
  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.reply({ content: `Button clicked! Args: ${args.join(", ")}`, ephemeral: true });
  }
};

export default handler;
