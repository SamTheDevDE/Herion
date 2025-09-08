import { UserContextMenuCommandInteraction } from "discord.js";
import { UserContextOptions } from "../../../types/interaction";

const handler: UserContextOptions = {
  name: "Who is this?",
  async execute(interaction: UserContextMenuCommandInteraction) {
    const user = interaction.targetUser;
    await interaction.reply({ content: `${user.tag} (${user.id})`, ephemeral: true });
  }
};

export default handler;
