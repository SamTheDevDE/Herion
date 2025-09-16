import { Message, Events } from "discord.js";
import { ExtendedClient } from "../../client";

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: ExtendedClient) {
        if (message.author.bot) return;
        let lookup = message.content.trim();
        if (!lookup) return;

        const trigger = client.messageTriggers.get(lookup.toLowerCase());
        if (!trigger) return;

        const keys = Array.isArray(trigger.key) ? trigger.key : [trigger.key];
        const matched = keys.some(k =>
            trigger.caseSensitive ? lookup === k : lookup.toLowerCase() === k.toLowerCase()
        );
        if (!matched) return;

        try {
            await trigger.execute(message, client);
        } catch (err) {
            console.error(`[MessageTrigger] Error executing trigger '${lookup}':`, err);
        }
    }
}