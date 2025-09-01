import { ActivityType, Client, Collection, GatewayIntentBits } from "discord.js";
import Logger from "./classes/Logger";
import Database from "./classes/Database"
import { LoadAbles, loadFiles } from './utils/Loader';
import * as config from "./config";
import { ExtendedClientOptions } from './types/client';
import { Command } from "./structures/Command";
import { SlashCommand } from "./structures/SlashCommand";
import { EventFile } from "./types/event";
import { ButtonOptions, ModalOptions, SelectMenuOptions, AutocompleteOptions } from "./types/interaction";

export class ExtendedClient extends Client implements ExtendedClientOptions {
    public guildEvents: Collection<string, EventFile> = new Collection();
    public clientEvents: Collection<string, EventFile> = new Collection();
    public slashCommands: Collection<string, SlashCommand> = new Collection();
    public messageCommands: Collection<string, Command> = new Collection();
    public buttons: Collection<string, ButtonOptions> = new Collection();
    public modals: Collection<string, ModalOptions> = new Collection();
    public selectMenus: Collection<string, SelectMenuOptions> = new Collection();
    public autoCompletes: Collection<string, AutocompleteOptions> = new Collection();
    public config: Collection<string, any> = new Collection();

    constructor() {
        super({
            shards: 'auto',
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ],
            allowedMentions: {
                repliedUser: true,
                parse: ["users"]
            },
            presence: {
                status: 'dnd',
                activities: [{
                    name: 'your members',
                    type: ActivityType.Watching
                }]
            }
        });
    }
}

class HerionClient {
    public log = Logger.getInstance();
    public db = new Database(this.log as Logger);
    public commands = new Collection();
    public events = new Collection();
    private token: string = "";
    private client = new ExtendedClient();

    constructor(tkn: string) {
        this.token = tkn;
        // loads the config into the client
        for (const [key, value] of Object.entries(config)) {
            this.client.config.set(key, value);
        }
    }

    async start(): Promise<void> {
      try {
        this.db.initialize();
        this.log.info("Database connection initialized.");

        await this.client.login(this.token);
        this.log.info("Discord client logged in successfully.");
        
        // Load all commands and events
        await this.loadAll();
      } catch (err) {
        this.log.error("Failed to start client:", err);
        process.exit(1);
      }
    }

    private async loadAll(): Promise<void> {
        try {
            // Load commands
            await loadFiles(__dirname + "/commands/message", LoadAbles.MessageCommands, this.client);
            await loadFiles(__dirname + "/commands/slash", LoadAbles.SlashCommands, this.client);
            
            // Load events
            await loadFiles(__dirname + "/events/client", LoadAbles.ClientEvents, this.client);
            await loadFiles(__dirname + "/events/guild", LoadAbles.GuildEvents, this.client);

            this.log.info(`Loaded ${this.client.messageCommands.size} message commands`);
            this.log.info(`Loaded ${this.client.slashCommands.size} slash commands`);
            this.log.info(`Loaded ${this.client.clientEvents.size} client events`);
            this.log.info(`Loaded ${this.client.guildEvents.size} guild events`);
        } catch (error) {
            this.log.error("Error loading files:", error);
        }
    }
};

export default HerionClient;