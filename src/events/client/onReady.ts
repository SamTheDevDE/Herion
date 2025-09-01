import { Events } from "discord.js"
import { ExtendedClient } from "../../client"
import Logger from "../../classes/Logger"

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: ExtendedClient) {
        const logger = Logger.getInstance();
        logBotDetails(logger, client);
    }
}


function logBotDetails(log: Logger, client: ExtendedClient) {
  const panel = `
                  ================= 🤖 BOT INFO PANEL =================
                   Username       : ${client.user?.username || "Unknown"}
                   Tag            : ${client.user?.tag || "Unknown"}
                   ID             : ${client.user?.id || "Unknown"}
                   Guilds         : ${client.guilds.cache.size}
                   All Events     : ${client.clientEvents.size + client.guildEvents.size}
                   Client Events  : ${client.clientEvents.size}
                   Guild Events   : ${client.guildEvents.size}
                   All Commands   : ${client.slashCommands.size + client.messageCommands.size}
                   SlashCommands  : ${client.slashCommands.size}
                   MessageCommands: ${client.messageCommands.size}
                   Buttons        : ${client.buttons.size}
                   Modals         : ${client.modals.size}
                   SelectMenus    : ${client.selectMenus.size}
                   AutoCompletes  : ${client.autoCompletes.size}
                  =====================================================
               `
  log.custom("Info Panel", panel)
}