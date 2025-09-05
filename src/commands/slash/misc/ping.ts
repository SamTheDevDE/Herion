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
        await interaction.reply({ content: 'Pinging...' });
        const sent = await interaction.fetchReply() as Message;
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
    }
}