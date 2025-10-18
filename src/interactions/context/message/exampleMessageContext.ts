import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ApplicationCommandType, MessageFlags } from 'discord.js';
import { MessageContextOptions } from "../../../types/interaction";

const handler: MessageContextOptions = {
  data: new ContextMenuCommandBuilder()
    .setName("Example Message Context")
    .setType(ApplicationCommandType.Message),
  async execute(interaction: MessageContextMenuCommandInteraction, args: string[]) {
    await interaction.reply({ content: `Message context menu used! Args: ${args.join(", ")}`, flags: MessageFlags.Ephemeral });
  }
};

export default handler;
