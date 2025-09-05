import { SlashCommandBuilder } from "discord.js";
import { SlashCommandExecuteOptions, SlashCommandStructure } from "../types/command";

export class ExtendedSlashCommandBuilder extends SlashCommandBuilder {
    ownerOnly?: boolean;
    aliases?: string[];
    category?: string;
    cooldown?: number;
    permissions?: {
        user?: string[];
        bot?: string[];
    };

    setOwnerOnly(ownerOnly: boolean) {
        this.ownerOnly = ownerOnly;
        return this;
    }

    setAliases(aliases: string[]) {
        this.aliases = aliases;
        return this;
    }

    setCategory(category: string) {
        this.category = category;
        return this;
    }

    setCooldown(cooldown: number) {
        this.cooldown = cooldown;
        return this;
    }

    setPermissions(permissions: { user?: string[]; bot?: string[] }) {
        this.permissions = permissions;
        return this;
    }
}

export class SlashCommand implements SlashCommandStructure{
    public name: String;
    public description: String;
    public aliases: String[];
    public category: String;
    public ownerOnly: Boolean;
    public cooldown: Number;
    public permissions: {
        user: string[];
        bot: string[];
    };
    public data: SlashCommandBuilder;

    constructor(
        data: SlashCommandBuilder,
        options: {
            aliases?: string[];
            category?: string;
            ownerOnly?: boolean;
            cooldown?: number;
            permissions?: {
                user?: string[];
                bot?: string[];
            };
        } = {}
    ) {
        this.name = data.name;
        this.description = data.description;
        this.aliases = options.aliases || [];
        this.category = options.category || 'Miscellaneous';
        this.ownerOnly = options.ownerOnly || false;
        this.cooldown = options.cooldown || 3;
        this.permissions = {
            user: options.permissions?.user || [],
            bot: options.permissions?.bot || []
        };
        this.data = data;
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        throw new Error('Method not implemented.');
    }
}