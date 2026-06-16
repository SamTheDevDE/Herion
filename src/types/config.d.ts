export interface BotConfig {
    token: string;
    prefix: string;
    ownerIds: string[];
    clientId: string;
    devGuildId?: string;
    environment: "development" | "production";
    colors: {
        primary: number;
        success: number;
        error: number;
        warning: number;
    };
    log_webhooks?: {
        error?: string;
        info?: string;
        debug?: string;
    };
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID: string;
            OWNER_ID: string;
            PREFIX: string;
            DEBUG: boolean;
            DATABASE_URL: string;
            NODE_ENV: "development" | "production";
            LOG_ERROR_WEBHOOK: string;
            LOG_INFO_WEBHOOK: string;
            LOG_DEBUG_WEBHOOK: string;
        }
    }
}
