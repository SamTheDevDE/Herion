import { ActivityType, Events } from "discord.js";
import { ExtendedClient } from "../../client";
import Logger from "../../classes/Logger";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: ExtendedClient) {
        const logger = Logger.getInstance();
        if (!client.user) return;
        logger.info(`Ready! Logged in as ${client.user.tag}`);
        try {
            await client.user.setPresence({
                activities: [{ name: ";help for commands", type: ActivityType.Playing }],
                status: "online"
            });
        } catch (err) {
            logger.error("Failed to set presence", err);
        }
    }
}