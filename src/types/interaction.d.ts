import { 
    ButtonInteraction, 
    ModalSubmitInteraction, 
    StringSelectMenuInteraction,
    AutocompleteInteraction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
    ContextMenuCommandBuilder
} from "discord.js";

export interface ButtonOptions {
    customId: string;
    execute(interaction: ButtonInteraction, args: string[]): Promise<any>;
}

export interface ModalOptions {
    customId: string;
    execute(interaction: ModalSubmitInteraction, args: string[]): Promise<any>;
}

export interface SelectMenuOptions {
    customId: string;
    execute(interaction: StringSelectMenuInteraction, args: string[]): Promise<any>;
}

export interface AutocompleteOptions {
    commandName: string;
    execute(interaction: AutocompleteInteraction, args: string[]): Promise<any>;
}

export interface MessageContextOptions {
    data: ContextMenuCommandBuilder;
    execute(interaction: MessageContextMenuCommandInteraction, args: string[]): Promise<any>;
}

export interface UserContextOptions {
    data: ContextMenuCommandBuilder;
    execute(interaction: UserContextMenuCommandInteraction, args: string[]): Promise<any>;
}