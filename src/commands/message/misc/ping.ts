import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";

export default class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Shows the bot latency',
            aliases: ['pong']
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const message = options.message;
        const sent = await message.reply('Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        
        await sent.edit(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${message.client.ws.ping}ms`);
    }
}