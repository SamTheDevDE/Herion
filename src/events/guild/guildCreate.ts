import { ActivityType, Events, Guild } from "discord.js";
import { ExtendedClient } from "../../client";
import Logger from "../../classes/Logger";
import Database from "../../classes/Database";

export default {
    name: Events.GuildCreate,
    once: false,
    async execute(guild: Guild, client: ExtendedClient) {
        const logger = Logger.getInstance();
        const database = new Database(logger);
        const db = database.getClient();
        const members = await guild.members.fetch();
        const memberIds = members.map(m => m.id);
        const dbUsers = await db?.user.findMany({
            where: { id: { in: memberIds } }
        });
        const memberConnect = dbUsers?.map(u => ({ id: u.id })) ?? [];
        const guildInDatabase = await db?.guilds.findUnique({
            where: { id: guild.id }
        });

        if (!guildInDatabase) {
            await db?.guilds.create({
                data: {
                    id: guild.id,
                    name: guild.name,
                    ownerId: guild.ownerId,
                    member: { connect: memberConnect }
                }
            }).catch(
                (err) => logger.error(`an error occurred creating the guild ${guild.name}(${guild.id}) in the database\n`, err)
            );
            logger.debug(`Successfully created the guild ${guild.name}(${guild.id}) in the database`);
        }
    }
}