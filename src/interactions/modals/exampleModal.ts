import { ModalSubmitInteraction } from "discord.js";
import { ModalOptions } from "../../types/interaction";

const handler: ModalOptions = {
  customId: "example_modal",
  async execute(interaction: ModalSubmitInteraction, args: string[]) {
    await interaction.reply({ content: `Modal submitted! Args: ${args.join(", ")}`, ephemeral: true });
  }
};

export default handler;
