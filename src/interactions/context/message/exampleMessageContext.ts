import { MessageContextMenuCommandInteraction } from "discord.js";
import { MessageContextOptions } from "../../../types/interaction";

const handler: MessageContextOptions = {
  name: "Example Message Context",
  async execute(interaction: MessageContextMenuCommandInteraction, args: string[]) {
    await interaction.reply({ content: `Message context menu used! Args: ${args.join(", ")}`, ephemeral: true });
  }
};

export default handler;
