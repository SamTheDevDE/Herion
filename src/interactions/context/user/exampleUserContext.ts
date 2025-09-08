import { UserContextMenuCommandInteraction } from "discord.js";
import { UserContextOptions } from "../../../types/interaction";

const handler: UserContextOptions = {
  name: "Example User Context",
  async execute(interaction: UserContextMenuCommandInteraction, args: string[]) {
    await interaction.reply({ content: `User context menu used! Args: ${args.join(", ")}`, ephemeral: true });
  }
};

export default handler;
