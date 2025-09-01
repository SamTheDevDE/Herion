import { Message } from "discord.js";

export interface CommandOptions {
    name: string;
    description: string;
    aliases?: string[];
    category?: string;
    ownerOnly?: boolean;
    cooldown?: number;
    permissions?: {
        user?: string[];
        bot?: string[];
    };
}

export interface CommandExecuteOptions {
    message: Message;
    args: string[];
}

export interface CommandStructure {
    execute(options: CommandExecuteOptions): Promise<any>;
}