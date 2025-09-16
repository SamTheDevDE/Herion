import { ChatInputCommandInteraction, Message } from "discord.js";
import { ExtendedClient } from "../client";

export interface CommandOptions {
    name: string;
    description: string;
    aliases?: string[];
    category?: string;
    ownerOnly?: boolean;
    enabled?: boolean;
    cooldown?: number;
    permissions?: {
        user?: PermissionResolvable[];
        bot?: PermissionResolvable[];
    };
    args?: {
        required: boolean,
        argList?: string[]
    };
    guildOnly?: {
        enabled: boolean,
        whitelist?: string[],
        blacklist?: string[]
    };
}

export interface CommandExecuteOptions {
    message: Message;
    client: ExtendedClient;
    args: string[];
}

export interface CommandStructure {
    execute(options: CommandExecuteOptions): Promise<any>;
}

export interface SlashCommandOptions {
    name: string;
    description: string;
    category?: string;
    ownerOnly?: boolean;
    cooldown?: number;
    permissions?: {
        user?: PermissionResolvable[];
        bot?: PermissionResolvable[];
    };
}

export interface SlashCommandExecuteOptions {
    interaction: ChatInputCommandInteraction;
    client: ExtendedClient;
}

export interface SlashCommandStructure {
    execute(options: SlashCommandExecuteOptions): Promise<any>;
}