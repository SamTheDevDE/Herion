import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";

export default class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Shows the bot latency',
            category: "miscellaneous",
            aliases: ['pong'],
            cooldown: 2,
            args: { required: false },
            guildOnly: { enabled: false }
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const message = options.message;
        // sends a probe message which is used to calculate the latency
        const sent = await message.reply('Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        // sends a finishing message showing the latency and api latency (which is the same but we don't talk abt it)
        await sent.edit(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${message.client.ws.ping}ms`);
    }
}