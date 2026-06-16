import { ChatInputCommandInteraction, version as discordJsVersion } from 'discord.js';
import { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder } from 'discord.js';
import { ExtendedSlashCommandBuilder, SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";

export default class StatsSlashCommand extends SlashCommand {
    constructor() {
        const data = new ExtendedSlashCommandBuilder()
            .setName('stats')
            .setDescription('Shows bot statistics and system information');
        super(data);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction: ChatInputCommandInteraction = options.interaction;
        const client = interaction.client;

        // Calculate uptime
        const uptimeMs = client.uptime ?? 0;
        const days = Math.floor(uptimeMs / 86400000);
        const hours = Math.floor((uptimeMs % 86400000) / 3600000);
        const minutes = Math.floor((uptimeMs % 3600000) / 60000);
        const seconds = Math.floor((uptimeMs % 60000) / 1000);
        const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Memory usage
        const memUsage = process.memoryUsage();
        const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(1);
        const heapTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(1);
        const rssMB = (memUsage.rss / 1024 / 1024).toFixed(1);

        // Guild and member counts
        const totalGuilds = client.guilds.cache.size;
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const avatarURL = client.user?.displayAvatarURL() ?? '';

        // Build the ComponentsV2 container
        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('📊 **Bot Statistics**')
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setThumbnailAccessory(
                        new ThumbnailBuilder({
                            media: { url: avatarURL },
                        })
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `**General**\n` +
                            `**Guilds:** ${totalGuilds}\n` +
                            `**Members:** ~${totalMembers}\n` +
                            `**Uptime:** ${uptimeStr}\n` +
                            `**Ping:** ${client.ws.ping}ms`
                        )
                    )
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**System**')
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `**Node.js:** ${process.version}\n` +
                    `**discord.js:** v${discordJsVersion}\n` +
                    `**Heap:** ${heapUsedMB}MB / ${heapTotalMB}MB\n` +
                    `**RSS:** ${rssMB}MB`
                )
            );

        await interaction.reply({
            components: [container],
        });
    }
}
