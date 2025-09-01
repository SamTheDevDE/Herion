import { BotConfig } from "./types/config";

const config: BotConfig = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    prefix: ";",
    ownerIds: ["YOUR_ID_HERE", "ANOTHER_ID_HERE"],
    environment: process.env.NODE_ENV || "development",
    colors: {
        primary: 0x3498db,
        success: 0x2ecc71,
        error: 0xe74c3c,
        warning: 0xf1c40f
    },
    log_webhooks: {
        error: "",
        info: "",
        debug: ""
    }
};

export default config;