export interface BotConfig {
    token: string;
    prefix: string;
    ownerIds: string[];
    clientId: string;
    guildId?: string;
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
            TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID?: string;
            NODE_ENV: "development" | "production";
        }
    }
}