import { 
    ButtonInteraction, 
    ModalSubmitInteraction, 
    StringSelectMenuInteraction,
    AutocompleteInteraction
} from "discord.js";

export interface ButtonOptions {
    customId: string;
    execute(interaction: ButtonInteraction): Promise<any>;
}

export interface ModalOptions {
    customId: string;
    execute(interaction: ModalSubmitInteraction): Promise<any>;
}

export interface SelectMenuOptions {
    customId: string;
    execute(interaction: StringSelectMenuInteraction): Promise<any>;
}

export interface AutocompleteOptions {
    commandName: string;
    execute(interaction: AutocompleteInteraction): Promise<any>;
}