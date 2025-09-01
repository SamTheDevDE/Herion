import { ChatInputCommandInteraction, Client, Collection, Message } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import type { Command } from "../structures/Command";
import { SlashCommand } from "../structures/SlashCommand";

export class CommandHandler {
    private client: Client;
    public commands: Collection<string, Command>;
    public slashCommands: Collection<string, SlashCommand>;
    public aliases: Collection<string, string>;

    constructor(client: Client) {
        this.client = client;
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.aliases = new Collection();
    }

    async loadCommands() {
        // Load message commands
        const messageCmdPath = join(__dirname, "..", "commands", "message");
        this.loadMessageCommands(messageCmdPath);

        // Load slash commands
        const slashCmdPath = join(__dirname, "..", "commands", "slash");
        await this.loadSlashCommands(slashCmdPath);

        console.log(`Loaded ${this.commands.size} message commands`);
        console.log(`Loaded ${this.slashCommands.size} slash commands`);
    }

    private loadMessageCommands(dir: string) {
        const files = readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const filePath = join(dir, file.name);

            if (file.isDirectory()) {
                this.loadMessageCommands(filePath);
                continue;
            }

            if (!file.name.endsWith('.js') && !file.name.endsWith('.ts')) continue;

            const CommandClass = require(filePath).default;
            const cmd: Command = new CommandClass();

            this.commands.set(cmd.name, cmd);
            cmd.aliases.forEach(alias => this.aliases.set(alias, cmd.name));
        }
    }

    private async loadSlashCommands(dir: string) {
        const files = readdirSync(dir, { withFileTypes: true });
        const commands = [];

        for (const file of files) {
            const filePath = join(dir, file.name);

            if (file.isDirectory()) {
                await this.loadSlashCommands(filePath);
                continue;
            }

            if (!file.name.endsWith('.js') && !file.name.endsWith('.ts')) continue;

            const CommandClass = require(filePath).default;
            const cmd: SlashCommand = new CommandClass();

            this.slashCommands.set(cmd.name, cmd);
            commands.push(cmd.data.toJSON());
        }

        if (commands.length > 0) {
            try {
                await this.client.application?.commands.set(commands);
            } catch (error) {
                console.error('Error registering slash commands:', error);
            }
        }
    }

    handleMessage(message: Message) {
        if (!message.content.startsWith('!')) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase() || '';

        const command = this.commands.get(commandName) 
            || this.commands.get(this.aliases.get(commandName) || '');

        if (!command) return;

        try {
            command.execute({ message, args });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command!');
        }
    }

    handleSlashCommand(interaction: ChatInputCommandInteraction) {
        const command = this.slashCommands.get(interaction.commandName);

        if (!command) return;

        try {
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'There was an error executing this command!',
                ephemeral: true
            });
        }
    }
}