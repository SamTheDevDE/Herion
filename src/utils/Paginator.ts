import { Message, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, InteractionCollector, ButtonInteraction } from "discord.js";

export class Paginator {
    private pages: EmbedBuilder[];
    private message: Message;
    private currentPage: number = 0;
    private collector?: any;

    constructor(pages: EmbedBuilder[], message: Message) {
        this.pages = pages;
        this.message = message;
    }

    async start(timeout = 60000) {
        if (this.pages.length === 0) return;
        const row = this.getRow();
        const sent = await this.message.reply({ embeds: [this.pages[0]], components: [row] });
        if (this.pages.length === 1) return;

        this.collector = sent.createMessageComponentCollector({ time: timeout });
    this.collector?.on('collect', async (i: any) => {
            if (!i.isButton()) return;
            if (i.user.id !== this.message.author.id) {
                await i.reply({ content: "You can't control this paginator!", ephemeral: true });
                return;
            }
            if (i.customId === 'prev') {
                this.currentPage = (this.currentPage - 1 + this.pages.length) % this.pages.length;
            } else if (i.customId === 'next') {
                this.currentPage = (this.currentPage + 1) % this.pages.length;
            }
            await i.update({ embeds: [this.pages[this.currentPage]], components: [this.getRow()] });
        });
        this.collector?.on('end', async () => {
            await sent.edit({ components: [] });
        });
    }

    private getRow() {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('◀️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.pages.length <= 1),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('▶️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.pages.length <= 1)
        );
    }
}
