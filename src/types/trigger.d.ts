import { Message } from "discord.js";
import { ExtendedClient } from "../client";

export interface MessageTriggerOptions {
    key: string[];
    caseSensitive: boolean;
}

export interface MessageTriggerStructure {
    execute(message: Message, client: ExtendedClient): Promise<any>;
}

export interface MessageTriggerFile extends MessageTriggerOptions, MessageTriggerStructure {}
