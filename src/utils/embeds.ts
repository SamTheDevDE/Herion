import { Colors, EmbedBuilder } from "discord.js";

/**
 * Creates a green success embed.
 *
 * @param title - The embed title
 * @param description - Optional description text
 * @returns A styled EmbedBuilder instance
 */
export function successEmbed(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`✅ ${title}`)
        .setColor(Colors.Green)
        .setDescription(description ?? null)
        .setTimestamp();
}

/**
 * Creates a red error embed.
 *
 * @param title - The embed title
 * @param description - Optional description text
 * @returns A styled EmbedBuilder instance
 */
export function errorEmbed(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`❌ ${title}`)
        .setColor(Colors.Red)
        .setDescription(description ?? null)
        .setTimestamp();
}

/**
 * Creates a yellow warning embed.
 *
 * @param title - The embed title
 * @param description - Optional description text
 * @returns A styled EmbedBuilder instance
 */
export function warningEmbed(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`⚠️ ${title}`)
        .setColor(Colors.Yellow)
        .setDescription(description ?? null)
        .setTimestamp();
}

/**
 * Creates a blue info embed.
 *
 * @param title - The embed title
 * @param description - Optional description text
 * @returns A styled EmbedBuilder instance
 */
export function infoEmbed(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`ℹ️ ${title}`)
        .setColor(Colors.Blue)
        .setDescription(description ?? null)
        .setTimestamp();
}
