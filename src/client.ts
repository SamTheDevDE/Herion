import { Client, Collection, GatewayIntentBits } from "discord.js";
import Logger from "./classes/Logger";
import Database from "./classes/Database"
import { LoadAbles, loadFiles } from './utils/Loader';
import config from "./config";
import { ExtendedClientOptions } from './types/client';
import { Command } from "./structures/Command";
import { SlashCommand } from "./structures/SlashCommand";
import { EventFile } from "./types/event";
import { ButtonOptions, ModalOptions, SelectMenuOptions, AutocompleteOptions, MessageContextOptions, UserContextOptions } from "./types/interaction";
import { MessageTriggerFile } from "./types/trigger";

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
    public messageContexts: Collection<string, MessageContextOptions> = new Collection();
    public userContexts: Collection<string, UserContextOptions> = new Collection();
    public messageTriggers: Collection<string, MessageTriggerFile> = new Collection();
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
            // loads interactions
            await loadFiles(__dirname + "/interactions/buttons", LoadAbles.Buttons, this.client);
            await loadFiles(__dirname + "/interactions/modals", LoadAbles.Modals, this.client);
            await loadFiles(__dirname + "/interactions/select-menus", LoadAbles.SelectMenus, this.client);
            await loadFiles(__dirname + "/interactions/autocomplete", LoadAbles.AutoCompletes, this.client);
            await loadFiles(__dirname + "/interactions/context/message", LoadAbles.MessageInteractions, this.client);
            await loadFiles(__dirname + "/interactions/context/user", LoadAbles.UserInteractions, this.client);
            // loads message triggers
            await loadFiles(__dirname + "/triggers/message", LoadAbles.MessageTriggers, this.client);
            // stats
            this.log.info(`Loaded ${this.client.messageCommands.size} message commands`);
            this.log.info(`Loaded ${this.client.slashCommands.size} slash commands`);
            this.log.info(`Loaded ${this.client.clientEvents.size} client events`);
            this.log.info(`Loaded ${this.client.guildEvents.size} guild events`);
            this.log.info(`Loaded ${this.client.buttons.size} buttons`);
            this.log.info(`Loaded ${this.client.messageContexts.size} Message Context Buttons`);
            this.log.info(`Loaded ${this.client.userContexts.size} User Context Buttons`);
            this.log.info(`Loaded ${this.client.modals.size} modals`);
            this.log.info(`Loaded ${this.client.selectMenus.size} select menus`);
            this.log.info(`Loaded ${this.client.autoCompletes.size} autocompletes`);
            this.log.info(`Loaded ${this.client.messageTriggers.size} message triggers`);
            
            try {
                // gets both normal slash commands and developer slash commands
                const commands = Array.from(this.client.slashCommands.values()).map(cmd => cmd.data.toJSON());
                const devCommands = Array.from(this.client.devSlashCommands.values()).map(cmd => cmd.data.toJSON());
                
                // get context menu commands
                const messageContexts = Array.from(this.client.messageContexts.values()).map(ctx => ctx.data.toJSON());
                const userContexts = Array.from(this.client.userContexts.values()).map(ctx => ctx.data.toJSON());
                
                // combine all application commands
                const allCommands = [...commands, ...messageContexts, ...userContexts];
                const allDevCommands = [...devCommands, ...messageContexts, ...userContexts];
                
                const devGuildId = this.client.config.get("devGuildId") as string | undefined;
                
                // if there aren't ANY commands don't do anything
                if (allCommands.length === 0 && allDevCommands.length === 0) {
                    this.log.debug('No application commands to register.');
                    return;
                }

                // Register dev commands to dev guild if in development mode
                if ((this.client.config.get('environment') as string) === 'development') {
                    if (devGuildId && allDevCommands.length > 0) {
                        this.log.info(`Registering ${allDevCommands.length} commands to dev guild (${devGuildId})`);
                        this.log.debug(`Commands: ${commands.length} slash, ${devCommands.length} dev slash, ${messageContexts.length} message context, ${userContexts.length} user context`);
                        try {
                            const guild = await this.client.guilds.fetch(devGuildId);
                            await guild.commands.set(allDevCommands);
                            this.log.info(`Registered ${allDevCommands.length} application commands to dev guild ${devGuildId}`);
                        } catch (err) {
                            this.log.error(`Failed to register commands to dev guild ${devGuildId}:`, err);
                        }
                    } else if (!devGuildId) {
                        this.log.info('No devGuildId set in config; registering all commands globally instead.');
                        // Fallback to global registration in development if no dev guild is set
                        if (allCommands.length > 0) {
                            try {
                                await this.client.application?.commands.set(allCommands);
                                this.log.info(`Registered ${allCommands.length} application commands globally (fallback)`);
                            } catch (err) {
                                this.log.error("Error registering global application commands:", err);
                            }
                        }
                    }
                } else {
                    // Production mode: Register regular commands globally, dev commands to dev guild
                    if (allCommands.length > 0) {
                        this.log.info(`Registering ${allCommands.length} commands globally...`);
                        this.log.debug(`Commands: ${commands.length} slash, ${messageContexts.length} message context, ${userContexts.length} user context`);
                        try {
                            await this.client.application?.commands.set(allCommands);
                            this.log.info(`Registered ${allCommands.length} application commands globally`);
                        } catch (err) {
                            this.log.error("Error registering global application commands:", err);
                        }
                    }
                    
                    // Also register dev commands to dev guild in production if needed
                    if (devGuildId && devCommands.length > 0) {
                        this.log.info(`Registering ${devCommands.length} dev commands to dev guild (${devGuildId})`);
                        try {
                            const guild = await this.client.guilds.fetch(devGuildId);
                            await guild.commands.set(devCommands);
                            this.log.info(`Registered ${devCommands.length} dev commands to dev guild ${devGuildId}`);
                        } catch (err) {
                            this.log.error(`Failed to register dev commands to dev guild ${devGuildId}:`, err);
                        }
                    }
                }
            } catch (err) {
                this.log.error("Error registering application commands:", err);
            }
        } catch (error) {
            this.log.error("Error loading files:", error);
        }
    }
};

export default HerionClient;