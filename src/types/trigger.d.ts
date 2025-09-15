import { Message } from "discord.js";
import { ExtendedClient } from "../client";

export interface MessageTriggerOptions {
    key: string[]; // trigger text, matched case-insensitively and exactly
}

export interface MessageTriggerStructure {
    execute(message: Message, client: ExtendedClient): Promise<any>;
}

export interface MessageTriggerFile extends MessageTriggerOptions, MessageTriggerStructure {}
