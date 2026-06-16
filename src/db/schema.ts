import { pgTable, text, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── User Table ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull(),
  roles: text("roles").array().notNull().default(["USER"]),
  isBlacklisted: boolean("is_blacklisted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Guild Table ──────────────────────────────────────────────
export const guilds = pgTable("guilds", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Guild Members (Junction Table) ───────────────────────────
export const guildMembers = pgTable(
  "guild_members",
  {
    guildId: text("guild_id")
      .notNull()
      .references(() => guilds.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.guildId, table.userId] }),
  })
);

// ─── Relations ────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  ownedGuilds: many(guilds, { relationName: "guildOwner" }),
  memberOf: many(guildMembers, { relationName: "guildMember" }),
}));

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  owner: one(users, {
    fields: [guilds.ownerId],
    references: [users.id],
    relationName: "guildOwner",
  }),
  members: many(guildMembers, { relationName: "guildMember" }),
}));

export const guildMembersRelations = relations(guildMembers, ({ one }) => ({
  guild: one(guilds, {
    fields: [guildMembers.guildId],
    references: [guilds.id],
    relationName: "guildMember",
  }),
  user: one(users, {
    fields: [guildMembers.userId],
    references: [users.id],
    relationName: "guildMember",
  }),
}));
