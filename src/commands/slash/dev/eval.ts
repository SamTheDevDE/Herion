import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ExtendedSlashCommandBuilder, SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";
import { inspect } from "util";

export default class EvalSlashCommand extends SlashCommand {
    constructor() {
        const data = new ExtendedSlashCommandBuilder()
            .setName('eval')
            .setDescription('Evaluates JavaScript code.')
            .setCategory("Developer")
            .setOwnerOnly(true)
            .addStringOption(option => {
                return option
                    .setName("code")
                    .setDescription("JavaScript code")
                    .setRequired(true)
            });
        super(data as SlashCommandBuilder);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction = options.interaction as ChatInputCommandInteraction;
        const code = interaction.options.getString("code", true);

        await interaction.deferReply({ flags: 64 });

        try {
            let result = eval(code);
            if (result instanceof Promise) result = await result;

            let output = typeof result === "string" ? result : inspect(result, { depth: 1 });
            if (output.length > 1900) output = output.slice(0, 1900) + "\n... (truncated)";

            await interaction.editReply({ content: `\`\`\`js\n${output}\n\`\`\`` });
        } catch (err) {
            const errStr = inspect(err, { depth: 1 });
            await interaction.editReply({ content: `\`\`\`js\n${errStr}\n\`\`\`` });
        }
    }
}