import { CommandExecuteOptions, CommandOptions, CommandStructure } from "../types/command";

export class Command implements CommandStructure {
    public name: string;
    public description: string;
    public aliases: string[];
    public category: string;
    public ownerOnly: boolean;
    public cooldown: number;
    public permissions: {
        user: string[];
        bot: string[];
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
    }

    async execute(options: CommandExecuteOptions): Promise<any> {
        throw new Error('Method not implemented.');
    }
}