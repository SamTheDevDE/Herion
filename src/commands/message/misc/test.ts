import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";

export default class PingCommand extends Command {
    constructor() {
        super({
            name: 'test',
            description: 'a template for a message command.',
            category: "miscellaneous",
            enabled: false,
            aliases: [''],
            cooldown: 0,
            ownerOnly: false,
            permissions: { user: [], bot: [] },
            args: { 
                required: false,
                argList: []
            },
            guildOnly: { 
                enabled: false,
                whitelist: [],
                blacklist: []
            }
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        // const message = options.message;
        // const client = options.client;
        // const args = options.args;
    }
}