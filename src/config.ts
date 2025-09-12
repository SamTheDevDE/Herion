import { BotConfig } from "./types/config";

const config: BotConfig = {
    token: process.env.TOKEN as string,
    clientId: process.env.CLIENT_ID as string,
    devGuildId: "1413558885352210493",
    prefix: ";",
    ownerId: "792037342771675187",
    environment: process.env.NODE_ENV || "development",
    colors: {
        primary: 0x3498db,
        success: 0x2ecc71,
        error: 0xe74c3c,
        warning: 0xf1c40f
    },
    log_webhooks: {
        error: "https://discord.com/api/webhooks/1413561290210676776/c4BN4wnL0FoXkPrSzadJ_gmfqFLSiRN_TInJM32uMltH6JgFs7x2FAWbKB24JuBSL7M3",
        info: "https://discord.com/api/webhooks/1413561290210676776/c4BN4wnL0FoXkPrSzadJ_gmfqFLSiRN_TInJM32uMltH6JgFs7x2FAWbKB24JuBSL7M3",
        debug: "https://discord.com/api/webhooks/1413561290210676776/c4BN4wnL0FoXkPrSzadJ_gmfqFLSiRN_TInJM32uMltH6JgFs7x2FAWbKB24JuBSL7M3"
    }
};

export default config;