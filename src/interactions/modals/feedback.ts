import { ModalSubmitInteraction } from "discord.js";
import { ModalOptions } from "../../types/interaction";

const handler: ModalOptions = {
  customId: "feedback_modal",
  async execute(interaction: ModalSubmitInteraction) {
    const feedback = interaction.fields.getTextInputValue("feedback_input");
    await interaction.reply({ content: `Thanks for your feedback: ${feedback}`, ephemeral: true });
  }
};

export default handler;
