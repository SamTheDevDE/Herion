import { PermissionResolvable } from "discord.js";
import { CommandExecuteOptions, CommandOptions, CommandStructure } from "../types/command";

export class Command implements CommandStructure {
    public name: string;
    public description: string;
    public aliases: string[];
    public category: string;
    public ownerOnly: boolean;
    public cooldown: number;
    public permissions: {
        user: PermissionResolvable[];
        bot: PermissionResolvable[];
    };
    public args?: {
        required: boolean;
        argList?: string[];
    };
    public guildOnly?: {
        enabled: boolean;
        whitelist?: string[];
        blacklist?: string[];
    };

    constructor(options: CommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.aliases = options.aliases || [];
        this.category = options.category || 'Miscellaneous';
        this.ownerOnly = options.ownerOnly || false;
        this.cooldown = options.cooldown || 3;
        this.permissions = {
            user: options.permissions?.user || [],
            bot: options.permissions?.bot || []
        };
        this.args = options.args
            ? {
                required: options.args.required,
                argList: options.args.argList || []
            }
            : undefined;
        this.guildOnly = options.guildOnly
            ? {
                enabled: options.guildOnly.enabled,
                whitelist: options.guildOnly.whitelist || [],
                blacklist: options.guildOnly.blacklist || []
            }
            : undefined;
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        throw new Error('Method not implemented.');
    }
}