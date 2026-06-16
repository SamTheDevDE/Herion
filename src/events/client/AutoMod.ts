import { Events, Message, ChannelType, TextChannel, NewsChannel, PublicThreadChannel, PrivateThreadChannel, VoiceChannel, StageChannel, ContainerBuilder, TextDisplayBuilder, MessageFlags } from "discord.js";
import { ExtendedClient } from "../../client";

/**
 * Auto-Moderation System
 * Runs on every message create before command handling.
 * Discord.js allows multiple listeners for the same event.
 */

// Spam tracking: userId → array of timestamps
const spamTracker = new Map<string, number[]>();

// Discord invite link regex (discord.gg/..., discord.com/invite/...)
const INVITE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|com)\/(?:invite\/)?)[a-zA-Z0-9]+/i;

// Link regex for general link detection
const LINK_REGEX = /https?:\/\/[^\s]+/i;

type SendableChannel = TextChannel | NewsChannel | PublicThreadChannel | PrivateThreadChannel | VoiceChannel | StageChannel;

function toSendableChannel(channel: any): SendableChannel | null {
    if (channel && typeof channel.send === "function") {
        return channel as SendableChannel;
    }
    return null;
}

/**
 * Send an auto-mod warning to a text-based channel.
 */
async function sendWarning(channel: SendableChannel, text: string): Promise<void> {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(text)
        );
    await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default {
    name: Events.MessageCreate,
    async execute(message: Message, client: ExtendedClient) {
        // Ignore bot messages and DMs
        if (message.author.bot) return;
        if (!message.guild || message.channel.type === ChannelType.DM) return;

        // Only act on sendable channels
        const sendableChannel = toSendableChannel(message.channel);
        if (!sendableChannel) return;

        // Read auto-mod rules from the in-memory config
        // Config keys: "automod.invites", "automod.spam", "automod.links"
        const automodInvites = client.config.has("automod.invites")
            ? client.config.get("automod.invites") as boolean
            : true; // default: enabled
        const automodSpam = client.config.has("automod.spam")
            ? client.config.get("automod.spam") as boolean
            : true; // default: enabled
        const automodLinks = client.config.has("automod.links")
            ? client.config.get("automod.links") as boolean
            : false; // default: disabled

        // --- Invite Link Detection ---
        if (automodInvites && INVITE_REGEX.test(message.content)) {
            try {
                await message.delete();
                await sendWarning(
                    sendableChannel,
                    `⚠️ **Auto-Mod Warning**\n<@${message.author.id}>, posting Discord invite links is not allowed in this server.`
                );
            } catch {
                // Missing permissions or message already deleted
            }
            return;
        }

        // --- Link Blocking ---
        if (automodLinks && LINK_REGEX.test(message.content)) {
            try {
                await message.delete();
                await sendWarning(
                    sendableChannel,
                    `⚠️ **Auto-Mod Warning**\n<@${message.author.id}>, posting links is not allowed in this server.`
                );
            } catch {
                // Missing permissions or message already deleted
            }
            return;
        }

        // --- Spam Detection (3+ messages within 2 seconds) ---
        if (automodSpam) {
            const now = Date.now();
            const userId = message.author.id;
            const userTimestamps = spamTracker.get(userId) || [];

            // Keep only timestamps from the last 2 seconds
            const recentTimestamps = userTimestamps.filter(ts => now - ts < 2000);
            recentTimestamps.push(now);
            spamTracker.set(userId, recentTimestamps);

            if (recentTimestamps.length >= 3) {
                try {
                    await message.delete();
                    await sendWarning(
                        sendableChannel,
                        `🛑 **Auto-Mod Spam Detection**\n<@${message.author.id}>, please don't send messages so quickly!`
                    );
                    // Reset spam tracker for this user after detection
                    spamTracker.set(userId, []);
                } catch {
                    // Missing permissions or message already deleted
                }
                return;
            }

            // Clean up old entries periodically (simple GC to prevent memory leaks)
            if (spamTracker.size > 1000) {
                for (const [key, timestamps] of spamTracker.entries()) {
                    const filtered = timestamps.filter(ts => now - ts < 2000);
                    if (filtered.length === 0) {
                        spamTracker.delete(key);
                    } else {
                        spamTracker.set(key, filtered);
                    }
                }
            }
        }
    }
};
