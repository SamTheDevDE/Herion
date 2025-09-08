import { AutocompleteInteraction } from "discord.js";
import { AutocompleteOptions } from "../../types/interaction";

const handler: AutocompleteOptions = {
  commandName: "example",
  async execute(interaction: AutocompleteInteraction, args: string[]) {
    await interaction.respond([
      { name: `Option 1 (${args.join(", ")})`, value: "option1" },
      { name: "Option 2", value: "option2" }
    ]);
  }
};

export default handler;
