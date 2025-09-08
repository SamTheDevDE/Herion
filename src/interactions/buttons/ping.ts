import { ButtonInteraction } from "discord.js";
import { ButtonOptions } from "../../types/interaction";

const handler: ButtonOptions = {
  customId: "ping",
  async execute(interaction: ButtonInteraction) {
    await interaction.reply({ content: `Pong! (${Date.now() - interaction.createdTimestamp}ms)`, ephemeral: true });
  }
};

export default handler;
