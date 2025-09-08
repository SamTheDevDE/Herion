import { AutocompleteInteraction } from "discord.js";
import { AutocompleteOptions } from "../../types/interaction";

const handler: AutocompleteOptions = {
  commandName: "ping",
  async execute(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    const choices = ["alpha", "beta", "gamma", "delta"].filter(c => c.startsWith(focused.value.toLowerCase())).slice(0, 5);
    await interaction.respond(choices.map(c => ({ name: c, value: c })));
  }
};

export default handler;
