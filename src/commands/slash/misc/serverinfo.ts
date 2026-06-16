import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder } from 'discord.js';
import { SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";

export default class ServerInfoSlashCommand extends SlashCommand {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('Shows information about the current server');
        super(data as any);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction: ChatInputCommandInteraction = options.interaction;
        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({
                content: 'This command can only be used in a server.',
            });
        }

        // Fetch owner
        const owner = await guild.fetchOwner();

        // Counts
        const memberCount = guild.memberCount;
        const channelCount = guild.channels.cache.size;
        const roleCount = guild.roles.cache.size;
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount ?? 0;

        // Boost level label
        const boostLabels: Record<number, string> = {
            0: 'None',
            1: 'Level 1',
            2: 'Level 2',
            3: 'Level 3',
        };
        const boostLabel = boostLabels[boostLevel] ?? 'Unknown';

        // Channel breakdown
        const textChannels = guild.channels.cache.filter(c => c.isTextBased() && !c.isThread()).size;
        const voiceChannels = guild.channels.cache.filter(c => c.isVoiceBased()).size;
        const threadChannels = guild.channels.cache.filter(c => c.isThread()).size;

        // Creation date
        const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

        const iconURL = guild.iconURL({ size: 1024 });

        const container = new ContainerBuilder();

        if (iconURL) {
            container.addSectionComponents(
                new SectionBuilder()
                    .setThumbnailAccessory(
                        new ThumbnailBuilder({
                            media: { url: iconURL },
                        })
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**${guild.name}**`)
                    )
            );
        } else {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${guild.name}**`)
            );
        }

        container
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Server Info**')
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `**ID:** \`${guild.id}\`\n` +
                    `**Owner:** ${owner.user.tag} (\`${owner.id}\`)\n` +
                    `**Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)\n` +
                    `**Boost:** ${boostLabel} (${boostCount} boosts)`
                )
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Counts**')
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `**Members:** ${memberCount}\n` +
                    `**Channels:** ${channelCount} (${textChannels} text, ${voiceChannels} voice, ${threadChannels} threads)\n` +
                    `**Roles:** ${roleCount}`
                )
            );

        await interaction.reply({
            components: [container],
        });
    }
}
