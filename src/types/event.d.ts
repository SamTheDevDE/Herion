import { ClientEvents } from "discord.js";
import { ExtendedClient } from "../client";

export interface EventOptions {
    name: keyof ClientEvents;
    once?: boolean;
}

export interface EventStructure {
    execute(...args: any[]): Promise<any>;
}

export interface EventFile extends EventOptions, EventStructure {
    execute(client: ExtendedClient, ...args: any[]): Promise<any>;
}