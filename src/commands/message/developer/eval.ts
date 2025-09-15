import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";
import { inspect } from "util";
import { readdirSync } from 'fs';

export default class EvalCommand extends Command {
    constructor() {
        super({
            name: 'eval',
            description: 'evaluates javascript code.',
            ownerOnly: true,
            category: "developer",
            args: { required: true },
            guildOnly: {
                enabled: true,
                whitelist: ["1413558885352210493"]
            }
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const message = options.message;
        // gets the javascript code
        const code = options.args[0]
        // create a standby message which can be edited.
        const standbyMsg = await message.reply("Evaluating javascript code... please standby!");
        try {
            // evaluate the code and store it in an variable called result
            let result = eval(code);
            if (result instanceof Promise) result = await result; // whatever this does (i didn't wrote this some random user on reddit did)

            let output = typeof result === "string" ? result : inspect(result, { depth: 1 });
            if (output.length > 1900) output = output.slice(0, 1900) + "\n... (truncated)";
            // reply with the output
            await standbyMsg.edit({ content: `Result:\n\`\`\`js\n${output}\n\`\`\`` });
        } catch (err) {
            // if error occurs reply with the error
            const errStr = inspect(err, { depth: 1 });
            await standbyMsg.edit({ content: `Error:\n\`\`\`js\n${errStr}\n\`\`\`` });
        }
    }
}