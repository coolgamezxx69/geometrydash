import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  friendCode: text("friend_code").notNull().unique(),
  coins: integer("coins").default(0).notNull(),
  unlockedLevels: integer("unlocked_levels").default(1).notNull(),
});

export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, blocked
});

export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  gameMode: text("game_mode").notNull(),
  winnerId: integer("winner_id").notNull(),
  participants: text("participants").notNull(), // JSON array of user IDs
  coinsAwarded: integer("coins_awarded").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertFriendSchema = createInsertSchema(friends);
export const insertGameResultSchema = createInsertSchema(gameResults);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertFriend = z.infer<typeof insertFriendSchema>;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type User = typeof users.$inferSelect;
export type Friend = typeof friends.$inferSelect;
export type GameResult = typeof gameResults.$inferSelect;
