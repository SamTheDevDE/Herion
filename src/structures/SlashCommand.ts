import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export class SlashCommand {
    public name: string;
    public description: string;
    public data: SlashCommandBuilder;

    constructor(data: SlashCommandBuilder) {
        this.name = data.name;
        this.description = data.description;
        this.data = data;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        throw new Error('Method not implemented.');
    }
}