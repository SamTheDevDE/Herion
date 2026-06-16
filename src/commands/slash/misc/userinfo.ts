import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption, User, GuildMember, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, Colors } from 'discord.js';
import { SlashCommand } from "../../../structures/SlashCommand";
import { SlashCommandExecuteOptions } from "../../../types/command";

export default class UserInfoSlashCommand extends SlashCommand {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('userinfo')
            .setDescription('Shows information about a user')
            .addUserOption((option: SlashCommandUserOption) =>
                option
                    .setName('target')
                    .setDescription('The user to look up (defaults to yourself)')
                    .setRequired(false)
            );
        super(data as any);
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        const interaction: ChatInputCommandInteraction = options.interaction;
        const targetUser: User = interaction.options.getUser('target') ?? interaction.user;
        const targetMember: GuildMember | null = interaction.guild?.members.cache.get(targetUser.id) ?? null;

        const createdTimestamp = Math.floor(targetUser.createdTimestamp / 1000);
        const joinedTimestamp = targetMember?.joinedTimestamp
            ? Math.floor(targetMember.joinedTimestamp / 1000)
            : null;

        const topRoles = targetMember?.roles.cache
            .filter(role => role.id !== interaction.guild?.id)
            .sort((a, b) => b.position - a.position)
            .first(5);

        const avatarURL = targetUser.displayAvatarURL({ size: 256 });

        const container = new ContainerBuilder()
            .setAccentColor(Colors.Blurple)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `👤 **User Information**\n${avatarURL}`
                )
            )
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `**Username:** ${targetUser.username}\n` +
                    `**Display Name:** ${targetMember?.displayName ?? targetUser.username}\n` +
                    `**ID:** \`${targetUser.id}\`\n` +
                    `**Bot:** ${targetUser.bot ? 'Yes 🤖' : 'No'}\n` +
                    `**Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)${joinedTimestamp ? `\n` : ''}` +
                    (joinedTimestamp ? `**Joined:** <t:${joinedTimestamp}:F> (<t:${joinedTimestamp}:R>)` : '')
                )
            );

        if (topRoles && topRoles.length > 0) {
            container.addSeparatorComponents(new SeparatorBuilder());
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `**Top Roles**\n${topRoles.map(role => role.toString()).join(' • ')}`
                )
            );
        }

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });
    }
}
