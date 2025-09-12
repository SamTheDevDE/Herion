export interface BotConfig {
    token: string;
    prefix: string;
    ownerId: string;
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
            DEBUG: boolean;
            DATABASE_URL: string;
            NODE_ENV: "development" | "production";
        }
    }
}