import { Command } from "../../../structures/Command";
import { CommandExecuteOptions } from "../../../types/command";
import config from "../../../config";
import { Message, EmbedBuilder } from "discord.js";
import { Paginator } from "../../../utils/Paginator";

export default class HelpCommand extends Command {
    constructor() {
        super({
            name: "help",
            description: "Displays all available commands.",
            category: "miscellaneous",
            aliases: ["commands"],
            cooldown: 2,
            args: { required: false },
            guildOnly: { enabled: false }
        });
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        const { message, client, args } = options;
        const devGuildId = config.devGuildId;
        const isDevGuild = message.guild?.id === devGuildId;
        const commands = client.messageCommands;

        // If a command name is provided, show detailed info
        if (args && args.length > 0) {
            const input = args[0].toLowerCase();
            // Find by name or alias
            const cmd = [...commands.values()].find(c => c.name === input || (c.aliases && c.aliases.includes(input)));
            if (!cmd || (!isDevGuild && cmd.category?.toLowerCase() === "developer")) {
                return message.reply({ content: `❌ Command not found.` });
            }
            const embed = new EmbedBuilder()
                .setTitle(`Command: ${cmd.name}`)
                .setColor(config.colors.primary)
                .setDescription(cmd.description || "No description provided.")
                .addFields(
                    { name: "Category", value: cmd.category ? `${cmd.category}` : "None", inline: true },
                    { name: "Aliases", value: cmd.aliases && cmd.aliases.length > 0 ? cmd.aliases.map(a => `${a}`).join(", ") : "None", inline: true },
                    { name: "Cooldown", value: `${cmd.cooldown || 3}s`, inline: true },
                    { name: "Guild Only", value: cmd.guildOnly?.enabled ? "Yes" : "No", inline: true },
                    { name: "Owner Only", value: cmd.ownerOnly ? "Yes" : "No", inline: true },
                );
            if (cmd.args?.required) {
                embed.addFields({ name: "Arguments", value: cmd.args.argList ? cmd.args.argList.join(", ") : "Required", inline: false });
            }
            return message.reply({ embeds: [embed] });
        }

        // Otherwise, show paginated help menu
        const categories: Record<string, any[]> = {};
        for (const [, cmd] of commands) {
            if (!isDevGuild && cmd.category?.toLowerCase() === "developer") continue;
            if (!categories[cmd.category]) categories[cmd.category] = [];
            // Only show main command, not aliases
            if (cmd.name && !categories[cmd.category].some(c => c.name === cmd.name)) {
                categories[cmd.category].push(cmd);
            }
        }
        // Build paginated embeds
        const embeds: EmbedBuilder[] = [];
        const allCats = Object.entries(categories);
        for (let i = 0; i < allCats.length; i++) {
            const [cat, cmds] = allCats[i];
            const embed = new EmbedBuilder()
                .setTitle(`📖 Help Menu`)
                .setColor(config.colors.primary)
                .setDescription(`Use \`${config.prefix}<command>\` to run a command.\n\n` +
                    `Category: **${cat.charAt(0).toUpperCase() + cat.slice(1)}**\nPage ${i + 1} of ${allCats.length}`)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
            embed.addFields({
                name: `Commands`,
                value: cmds.map(c => `\`${c.name}\` — ${c.description}`).join("\n"),
                inline: false
            });
            embeds.push(embed);
        }
        const paginator = new Paginator(embeds, message);
        return paginator.start();
    }
}
