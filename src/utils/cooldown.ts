import { Collection } from "discord.js";

/**
 * Checks whether a user is on cooldown for a specific command.
 *
 * @param cooldowns - The client's cooldown Collection (commandName → userId → timestamp)
 * @param commandName - The name of the command being checked
 * @param userId - The ID of the user attempting the command
 * @param cooldownSeconds - The cooldown duration in seconds
 * @returns An object indicating whether the user is on cooldown and the remaining time in seconds
 */
export function checkCooldown(
    cooldowns: Collection<string, Collection<string, number>>,
    commandName: string,
    userId: string,
    _cooldownSeconds: number
): { onCooldown: boolean; timeLeft?: number } {
    const timestamps = cooldowns.get(commandName);
    if (!timestamps) {
        return { onCooldown: false };
    }

    const expirationTime = timestamps.get(userId);
    if (!expirationTime) {
        return { onCooldown: false };
    }

    const now = Date.now();
    if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return { onCooldown: true, timeLeft };
    }

    // Cooldown has expired; clean up the entry
    timestamps.delete(userId);
    return { onCooldown: false };
}

/**
 * Sets a cooldown for a user on a specific command. The entry auto-expires
 * after the given duration (handled by checkCooldown).
 *
 * @param cooldowns - The client's cooldown Collection (commandName → userId → timestamp)
 * @param commandName - The name of the command
 * @param userId - The ID of the user
 * @param cooldownSeconds - The cooldown duration in seconds
 */
export function setCooldown(
    cooldowns: Collection<string, Collection<string, number>>,
    commandName: string,
    userId: string,
    cooldownSeconds: number
): void {
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Collection());
    }

    const timestamps = cooldowns.get(commandName)!;
    const expirationTime = Date.now() + cooldownSeconds * 1000;
    timestamps.set(userId, expirationTime);

    // Auto-expire the entry after the cooldown period to prevent memory leaks
    setTimeout(() => {
        timestamps.delete(userId);
    }, cooldownSeconds * 1000);
}
