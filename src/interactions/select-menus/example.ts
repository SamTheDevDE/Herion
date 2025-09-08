import { StringSelectMenuInteraction } from "discord.js";
import { SelectMenuOptions } from "../../types/interaction";

const handler: SelectMenuOptions = {
  customId: "example_select",
  async execute(interaction: StringSelectMenuInteraction) {
    await interaction.reply({ content: `You chose: ${interaction.values.join(", ")}`, ephemeral: true });
  }
};

export default handler;
