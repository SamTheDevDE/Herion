import { Message, Events } from "discord.js";
import { ExtendedClient } from "../../client";

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: ExtendedClient) {
        if (message.author.bot) return;
        const content = message.content?.trim().toLowerCase();
        if (!content) return;

        const trigger = client.messageTriggers.get(content);
        if (!trigger) return;
        try {
            await trigger.execute(message, client);
        } catch (err) {
            console.error(`[MessageTrigger] Error executing trigger '${content}':`, err);
        }
    }
}