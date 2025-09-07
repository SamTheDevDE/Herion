import { SlashCommandBuilder } from "discord.js";
import { SlashCommandExecuteOptions, SlashCommandStructure } from "../types/command";
import { PermissionResolvable } from "discord.js";

export class ExtendedSlashCommandBuilder extends SlashCommandBuilder {
    ownerOnly?: boolean;
    category?: string;
    cooldown?: number;
    permissions?: {
        user?: PermissionResolvable[];
        bot?: PermissionResolvable[];
    };

    setOwnerOnly(ownerOnly: boolean) {
        this.ownerOnly = ownerOnly;
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

    setPermissions(permissions: { user?: PermissionResolvable[]; bot?: PermissionResolvable[] }) {
        this.permissions = permissions;
        return this;
    }
}

export class SlashCommand implements SlashCommandStructure{
    public name: String;
    public description: String;
    public category: String;
    public ownerOnly: Boolean;
    public cooldown: Number;
    public permissions: {
        user: PermissionResolvable[];
        bot: PermissionResolvable[];
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
        this.category = options.category || 'Miscellaneous';
        this.ownerOnly = options.ownerOnly || false;
        this.cooldown = options.cooldown || 3;
        this.permissions = {
            user: (options.permissions?.user as PermissionResolvable[]) || [],
            bot: (options.permissions?.bot as PermissionResolvable[]) || []
        };
        this.data = data;
    }

    async execute(options: SlashCommandExecuteOptions): Promise<any> {
        throw new Error('Method not implemented.');
    }
}