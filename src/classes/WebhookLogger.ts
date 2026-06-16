import { EmbedBuilder, WebhookClient } from "discord.js";
import { ExtendedClient } from "../client";

type LogWebhooks = {
    error?: string;
    info?: string;
    debug?: string;
};

export class WebhookLogger {
    /**
     * Sends an error embed to the configured error webhook.
     */
    static async sendError(client: ExtendedClient, title: string, description?: string): Promise<void> {
        const webhooks = client.config.get("log_webhooks") as LogWebhooks | undefined;
        const url = webhooks?.error;
        if (!url) return;

        try {
            const webhook = new WebhookClient({ url });
            const embed = new EmbedBuilder()
                .setTitle(`❌ ${title}`)
                .setColor(0xe74c3c)
                .setTimestamp();

            if (description) embed.setDescription(description);

            await webhook.send({ embeds: [embed] });
        } catch {
            // Silently fail — webhooks should never crash the bot
        }
    }

    /**
     * Sends an info embed to the configured info webhook.
     */
    static async sendInfo(client: ExtendedClient, title: string, description?: string): Promise<void> {
        const webhooks = client.config.get("log_webhooks") as LogWebhooks | undefined;
        const url = webhooks?.info;
        if (!url) return;

        try {
            const webhook = new WebhookClient({ url });
            const embed = new EmbedBuilder()
                .setTitle(`ℹ️ ${title}`)
                .setColor(0x3498db)
                .setTimestamp();

            if (description) embed.setDescription(description);

            await webhook.send({ embeds: [embed] });
        } catch {
            // Silently fail
        }
    }

    /**
     * Sends a debug embed to the configured debug webhook.
     */
    static async sendDebug(client: ExtendedClient, title: string, description?: string): Promise<void> {
        const webhooks = client.config.get("log_webhooks") as LogWebhooks | undefined;
        const url = webhooks?.debug;
        if (!url) return;

        try {
            const webhook = new WebhookClient({ url });
            const embed = new EmbedBuilder()
                .setTitle(`🐛 ${title}`)
                .setColor(0xf1c40f)
                .setTimestamp();

            if (description) embed.setDescription(description);

            await webhook.send({ embeds: [embed] });
        } catch {
            // Silently fail
        }
    }
}
