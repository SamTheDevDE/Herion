import { Events, Guild } from "discord.js";
import { ExtendedClient } from "../../client";
import Logger from "../../classes/Logger";
import { db } from "../../db";
import { users, guilds, guildMembers } from "../../db/schema";
import { eq, inArray } from "drizzle-orm";

export default {
    name: Events.GuildCreate,
    once: false,
    async execute(guild: Guild, _client: ExtendedClient) {
        const logger = Logger.getInstance();

        try {
            const members = await guild.members.fetch();
            const memberIds = members.map(m => m.id);

            // Find existing users in DB
            const dbUsers = await db
                .select({ id: users.id })
                .from(users)
                .where(inArray(users.id, memberIds));

            const existingUserIds = new Set(dbUsers.map(u => u.id));

            // Insert users that don't exist yet
            const newUsers = memberIds
                .filter(id => !existingUserIds.has(id))
                .map(id => ({
                    id,
                    username: members.get(id)?.user.username || "Unknown",
                }));

            if (newUsers.length > 0) {
                await db.insert(users).values(newUsers).catch(() => {});
            }

            // Check if guild already in DB
            const [guildInDb] = await db
                .select({ id: guilds.id })
                .from(guilds)
                .where(eq(guilds.id, guild.id))
                .limit(1);

            if (!guildInDb) {
                // Insert guild
                await db.insert(guilds).values({
                    id: guild.id,
                    name: guild.name,
                    ownerId: guild.ownerId,
                }).catch((err) => logger.error(`Error creating guild ${guild.name}(${guild.id}):\n`, err));

                // Insert guild members
                const memberConnections = memberIds.map(userId => ({
                    guildId: guild.id,
                    userId,
                }));

                if (memberConnections.length > 0) {
                    await db.insert(guildMembers).values(memberConnections).catch(() => {});
                }

                logger.debug(`Successfully created guild ${guild.name}(${guild.id}) in the database`);
            }
        } catch (err) {
            logger.error(`Error during guild create for ${guild.name}(${guild.id}):`, err);
        }
    }
};

