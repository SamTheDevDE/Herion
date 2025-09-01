import { Client, ActivityType, Collection } from 'discord.js';
import Logger from "./classes/Logger";
import Database from "./classes/Database"
import { LoadAbles, loadFiles } from './utils/Loader';

export class ExtendedClient extends Client {
    public guildEvents = new Collection<string, any>()
    public clientEvents = new Collection<string, any>()
    public slashCommands = new Collection<string, any>()
    public messageCommands = new Collection<string, any>()
    public buttons = new Collection<string, any>()
    public modals = new Collection<string, any>()
    public selectMenus = new Collection<string, any>()
    public autoCompletes = new Collection<string, any>()
}

class HerionClient  {
    public log = Logger.getInstance();
    public db = new Database(this.log as Logger);
    public commands = new Collection();
    public events = new Collection();
    private token: string = "";
    private client = new ExtendedClient({
        shards: 'auto',
        intents: ['GuildMessages', 'MessageContent', 'GuildMessageReactions'],
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

    constructor(tkn: string) {
        this.token = tkn;
    }

    async start(): Promise<void> {
      try {
        this.db.initialize();
        this.log.info("Database connection initialized.");

        await this.client.login(this.token);
        this.log.info("Discord client logged in successfully.");
        // load client events
        await loadFiles(__dirname + "/events/client", LoadAbles.ClientEvents, this.client);
        // load guild events
        await loadFiles(__dirname + "/events/guild", LoadAbles.GuildEvents, this.client);
      } catch (err) {
        this.log.error("Failed to start client:", err);
        process.exit(1);
      }
    }
};

export default HerionClient;