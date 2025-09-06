import { ChatInputCommandInteraction, Message } from 'discord.js';
import { ExtendedSlashCommandBuilder, SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";

export default class PingSlashCommand extends SlashCommand {
    constructor() {
        const data = new ExtendedSlashCommandBuilder()
            .setName('ping')
            .setDescription('Shows the bot latency');
            
        super(data);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction: ChatInputCommandInteraction = options.interaction;
        // sends a probe message
        await interaction.reply({ content: 'Pinging...' });
        // fetch the message
        const sent = await interaction.fetchReply() as Message;
        // create a timestamp for the message and the initial interaction. 
        // Subtract both the probe message timestamp and the initial interaction timestamp to get the latency 
        // (or the amount it took for the code to do something)
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        // edit the probe message to show the latency and api latency (which as i already mentioned is the same) 
        await interaction.editReply(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
    }
}