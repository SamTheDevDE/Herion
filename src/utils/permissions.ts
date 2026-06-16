import { GuildMember, GuildTextBasedChannel, Message, PermissionResolvable } from "discord.js";

/**
 * Checks whether the message author has all the required permissions in the current channel.
 * Always returns `true` in DM channels since permission checks do not apply there.
 *
 * @param message - The message that triggered the command
 * @param requiredPerms - An array of PermissionResolvable flags the user must have
 * @returns `true` if the user has all required permissions (or is in a DM), `false` otherwise
 */
export function checkUserPermissions(
    message: Message,
    requiredPerms: PermissionResolvable[]
): boolean {
    // DM channels have no guild permissions; skip the check
    if (!message.guild || !message.member) {
        return true;
    }

    const member = message.member as GuildMember;
    const channel = message.channel as GuildTextBasedChannel;

    for (const perm of requiredPerms) {
        if (!member.permissionsIn(channel).has(perm)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks whether the bot itself has all the required permissions in the current channel.
 * Always returns `true` in DM channels since permission checks do not apply there.
 *
 * @param message - The message that triggered the command
 * @param requiredPerms - An array of PermissionResolvable flags the bot must have
 * @returns `true` if the bot has all required permissions (or is in a DM), `false` otherwise
 */
export function checkBotPermissions(
    message: Message,
    requiredPerms: PermissionResolvable[]
): boolean {
    // DM channels have no guild permissions; skip the check
    if (!message.guild || !message.guild.members.me) {
        return true;
    }

    const botMember = message.guild.members.me;
    const channel = message.channel as GuildTextBasedChannel;

    for (const perm of requiredPerms) {
        if (!botMember.permissionsIn(channel).has(perm)) {
            return false;
        }
    }

    return true;
}
