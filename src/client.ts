import { ActivityType, Client, Collection, GatewayIntentBits } from "discord.js";
import Logger from "./classes/Logger";
import Database from "./classes/Database"
import { LoadAbles, loadFiles } from './utils/Loader';
import config from "./config";
import { ExtendedClientOptions } from './types/client';
import { Command } from "./structures/Command";
import { SlashCommand } from "./structures/SlashCommand";
import { EventFile } from "./types/event";
import { ButtonOptions, ModalOptions, SelectMenuOptions, AutocompleteOptions } from "./types/interaction";

export class ExtendedClient extends Client implements ExtendedClientOptions {
    // some public variables
    public guildEvents: Collection<string, EventFile> = new Collection();
    public clientEvents: Collection<string, EventFile> = new Collection();
    public slashCommands: Collection<string, SlashCommand> = new Collection();
    public devSlashCommands: Collection<string, SlashCommand> = new Collection();
    public messageCommands: Collection<string, Command> = new Collection();
    public cooldowns: Collection<string, Collection<string, number>> = new Collection();
    public buttons: Collection<string, ButtonOptions> = new Collection();
    public modals: Collection<string, ModalOptions> = new Collection();
    public selectMenus: Collection<string, SelectMenuOptions> = new Collection();
    public autoCompletes: Collection<string, AutocompleteOptions> = new Collection();
    public config: Collection<string, any> = new Collection();

    // change this in order to change the presence, allowedMentions, intents and the shard amount
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
        // loads the config file into the client for client-wide config readability
        for (const [key, value] of Object.entries(config)) {
            this.client.config.set(key, value);
        }
    }
    // a function to start the client
    async start(): Promise<void> {
      try {
        // initialize the database and log the success
        this.db.initialize();
        this.log.info("Database connection initialized.");
        // then log into the client and log success
        await this.client.login(this.token);
        this.log.info("Discord client logged in successfully.");
        // then load everything (aka load commands slash commands, events etc )
        await this.loadAll();
      } catch (err) {
        // if error then log error
        this.log.error("Failed to start client:", err);
        process.exit(1);
      }
    }

    private async loadAll(): Promise<void> {
        try {
            // loads the events
            await loadFiles(__dirname + "/events/client", LoadAbles.ClientEvents, this.client);
            await loadFiles(__dirname + "/events/guild", LoadAbles.GuildEvents, this.client);
            // loads the commands
            await loadFiles(__dirname + "/commands/message", LoadAbles.MessageCommands, this.client);
            await loadFiles(__dirname + "/commands/slash", LoadAbles.SlashCommands, this.client);
            // stats
            this.log.info(`Loaded ${this.client.messageCommands.size} message commands`);
            this.log.info(`Loaded ${this.client.slashCommands.size} slash commands`);
            this.log.info(`Loaded ${this.client.clientEvents.size} client events`);
            this.log.info(`Loaded ${this.client.guildEvents.size} guild events`);
            
            try {
                // gets both normal slash commands and developer slash commands
                const commands = Array.from(this.client.slashCommands.values()).map(cmd => cmd.data.toJSON());
                const devCommands = Array.from(this.client.devSlashCommands.values()).map(cmd => cmd.data.toJSON());
                const devGuildId = this.client.config.get("devGuildId") as string | undefined;
                // if there aren't ANY slash commands don't do anything
                if (commands.length === 0 && devCommands.length === 0) {
                    this.log.debug('No slash commands to register.');
                    return;
                }
                // if the node environment is set to development register the developer commands to the development guild
                if ((this.client.config.get('environment') as string) === 'development') {
                    // if the devGuildId is not set don't do anything
                    if (!devGuildId) {
                        this.log.debug('No devGuildId set in config; cannot register dev commands.');
                        return;
                    }
                    this.log.info(`Registering slash commands in the dev guild (${devGuildId})`);
                    // register both normal and dev commands to the dev guild
                    const allDevCommands = [...commands, ...devCommands];
                    try {
                        const guild = await this.client.guilds.fetch(devGuildId);
                        await guild.commands.set(allDevCommands);
                        this.log.info(`Registered ${allDevCommands.length} slash commands to guild ${devGuildId}`);
                    } catch (err) {
                        this.log.error(`Failed to register commands to dev guild ${devGuildId}:`, err);
                    }
                } else {
                    this.log.info(`Registering slash commands globally...`);
                    try {
                        await this.client.application?.commands.set(commands);
                        this.log.info(`Registered ${commands.length} slash commands globally`);
                    } catch (err) {
                        this.log.error("Error registering global slash commands:", err);
                    }
                }
            } catch (err) {
                this.log.error("Error registering slash commands:", err);
            }
        } catch (error) {
            this.log.error("Error loading files:", error);
        }
    }
};

export default HerionClient;