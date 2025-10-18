import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { ExtendedSlashCommandBuilder, SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";

export default class PingSlashCommand extends SlashCommand {
    constructor() {
        const data = new ExtendedSlashCommandBuilder()
            .setName('echo')
            .setDescription('Lets the bot say what u want')
            .setOwnerOnly(true)
            .addStringOption(option => {
                return option
                    .setName("message")
                    .setDescription("The message you want the bot to say")
                    .setRequired(true)
            })
            .addChannelOption(option => {
                return option
                    .setName("channel")
                    .setDescription("The Channel where the message gets send")
                    .setRequired(true)
            });
        super(data as SlashCommandBuilder);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction: ChatInputCommandInteraction = options.interaction;
        const content: string = options.interaction.options.getString("message", true);
        const channelId: string = options.interaction.options.getChannel("channel", true).id;

        // Get the actual channel object
        const channel = interaction.guild?.channels.cache.get(channelId);
        
        if (!channel?.isTextBased()) {
            await interaction.reply({ content: "Invalid channel selected!", flags: MessageFlags.Ephemeral });
            return;
        }

        try {
            await channel.send({ content });
            await interaction.reply({ content: `Message sent to ${channel}!`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await interaction.reply({ content: "Failed to send message!", flags: MessageFlags.Ephemeral });
        }
    }
}