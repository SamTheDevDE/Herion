import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../structures/SlashCommand";

export default class PingSlashCommand extends SlashCommand {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Shows the bot latency');
            
        super(data);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        const sent = await interaction.reply({ content: 'Pinging...', withResponse: true });
        const latency = sent.interaction.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
    }
}