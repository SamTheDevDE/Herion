import { ApplicationCommandType, ContextMenuCommandBuilder, MessageFlags, UserContextMenuCommandInteraction } from "discord.js";
import { UserContextOptions } from "../../../types/interaction";

const handler: UserContextOptions = {
  data: new ContextMenuCommandBuilder()
    .setName("Example User Context")
    .setType(ApplicationCommandType.User),
  async execute(interaction: UserContextMenuCommandInteraction, args: string[]) {
    await interaction.reply({ content: `User context menu used on ${interaction.targetUser.username}, Args: ` + args.join(", "), flags: [MessageFlags.Ephemeral] });
  }
};

export default handler;