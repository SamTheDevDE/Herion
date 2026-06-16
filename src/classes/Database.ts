import { db } from "../db";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import Logger from "./Logger";

type DbClient = NodePgDatabase<typeof schema>;

class Database {
    private static _instance: DbClient | null = null;
    private _log: Logger;

    public constructor(logger: Logger) {
        this._log = logger;
        this.initialize();
    }

    initialize() {
        if (!Database._instance) {
            try {
                Database._instance = db;
                this._log.info("Drizzle client initialized successfully.");
            } catch (error) {
                this._log.error("Failed to initialize Drizzle client:", error);
                throw error;
            }
        }
    }

    getClient(): DbClient | null {
        return Database._instance;
    }
}

export default Database;
