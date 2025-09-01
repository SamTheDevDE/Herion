import { Client, Collection } from "discord.js";
import { Command } from "../structures/Command";
import { SlashCommand } from "../structures/SlashCommand";
import { EventFile } from "./event";
import { ButtonOptions, ModalOptions, SelectMenuOptions, AutocompleteOptions } from "./interaction";

export interface ExtendedClientOptions extends Client {
    guildEvents: Collection<string, EventFile>;
    clientEvents: Collection<string, EventFile>;
    slashCommands: Collection<string, SlashCommand>;
    messageCommands: Collection<string, Command>;
    buttons: Collection<string, ButtonOptions>;
    modals: Collection<string, ModalOptions>;
    selectMenus: Collection<string, SelectMenuOptions>;
    autoCompletes: Collection<string, AutocompleteOptions>;
    config: Collection<string, any>;
}