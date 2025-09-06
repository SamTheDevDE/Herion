import { PrismaClient } from '@prisma/client';
import Logger from './Logger'

class Database {
    private static _instance: PrismaClient | null = null;
    private _log: Logger;

    public constructor(logger: Logger) {
        this._log = logger;
        this.initialize();
    }

    initialize() {
        // checks if there is already an instance of "database" if not make one
        if (!Database._instance) {
            try {
                Database._instance = new PrismaClient();
                Database._instance.$connect()
                    .then(() => this._log.info('Prisma client connected successfully.'))
                    .catch((err: any) => this._log.error('Error connecting to Prisma client:', err));
            } catch (error) {
                this._log.error('Failed to initialize Prisma client:', error);
                throw error;
            }
        }
    }

    getClient() {
        // returns the database client
        return Database._instance;
    }
}

export default Database;