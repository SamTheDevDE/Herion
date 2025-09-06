import { Events } from "discord.js"
import { ExtendedClient } from "../../client"
import Logger from "../../classes/Logger"

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: ExtendedClient) {
        const logger = Logger.getInstance();
        // if the client user is not defined (idk when this happens) log the error
        if (!client.user) {
            logger.error("Client user is not defined!");
            return;
        }
        // log that the bot is online and ready to be used
        logger.info(`Ready! Logged in as ${client.user.tag}`);
        // get stats
        const stats = [
            `Guilds: ${client.guilds.cache.size}`,
            `Commands: ${client.messageCommands.size} message, ${client.slashCommands.size} slash`,
            `Events: ${client.clientEvents.size} client, ${client.guildEvents.size} guild`
        ].join('\n');
        // log the stats
        logger.custom('Bot Statistics', stats);
    }
}