import { ButtonInteraction, MessageFlags } from "discord.js";
import { ButtonOptions } from "../../types/interaction";

const handler: ButtonOptions = {
  customId: "example_button",
  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.reply({ content: `Button clicked! Args: ${args.join(", ")}`, flags: MessageFlags.Ephemeral });
  }
};

export default handler;
