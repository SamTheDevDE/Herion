import { MessageFlags, StringSelectMenuInteraction } from "discord.js";
import { SelectMenuOptions } from "../../types/interaction";

const handler: SelectMenuOptions = {
  customId: "example_select",
  async execute(interaction: StringSelectMenuInteraction, args: string[]) {
    await interaction.reply({ content: `You chose: ${interaction.values.join(", ")}. Args: ${args.join(", ")}`, flags: MessageFlags.Ephemeral });
  }
};

export default handler;
