import { Message, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ContainerBuilder, MessageFlags } from "discord.js";

export class Paginator {
    private pages: EmbedBuilder[];
    private message: Message;
    private currentPage: number = 0;
    private collector?: any;
    private categories: string[];
    private categorySelect?: StringSelectMenuBuilder;

    constructor(pages: EmbedBuilder[], message: Message, categories?: string[]) {
        this.pages = pages;
        this.message = message;
        this.categories = categories || [];
        if (this.categories.length > 0) {
            this.categorySelect = new StringSelectMenuBuilder()
                .setCustomId('category_select')
                .setPlaceholder('Select a category')
                .addOptions(
                    ...this.categories.map((cat, idx) => ({
                        label: cat,
                        value: idx.toString(),
                    }))
                );
        }
    }

    async start(timeout = 60000) {
        if (this.pages.length === 0) return;
        const container = this.getContainerWithPageContent();
        const sent = await this.message.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });
        if (this.pages.length === 1) return;

        this.collector = sent.createMessageComponentCollector({ time: timeout });
        this.collector?.on('collect', async (i: any) => {
            if (!i.isButton() && !i.isStringSelectMenu()) return;
            if (i.user.id !== this.message.author.id) {
                await i.reply({ content: "You can't control this paginator!", flags: MessageFlags.Ephemeral });
                return;
            }
            if (i.isButton()) {
                if (i.customId === 'prev') {
                    this.currentPage = (this.currentPage - 1 + this.pages.length) % this.pages.length;
                } else if (i.customId === 'next') {
                    this.currentPage = (this.currentPage + 1) % this.pages.length;
                }
            } else if (i.isStringSelectMenu() && i.customId === 'category_select') {
                const idx = parseInt(i.values[0], 10);
                if (!isNaN(idx) && idx >= 0 && idx < this.pages.length) {
                    this.currentPage = idx;
                }
            }
            await i.update({
                components: [this.getContainerWithPageContent()],
                flags: MessageFlags.IsComponentsV2,
            });
        });
        this.collector?.on('end', async () => {
            await sent.edit({ components: [] });
        });
    }

    private getContainerWithPageContent() {
        const prevButton = new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('◀️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(this.pages.length <= 1);
        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(this.pages.length <= 1);

        // Convert the current embed page to markdown text for the text display
        const embed = this.pages[this.currentPage];
        let content = '';
        if (embed) {
            // Only basic fields for now; can be extended for more embed features
            if (embed.data.title) content += `**${embed.data.title}**\n`;
            if (embed.data.description) content += `${embed.data.description}\n`;
            if (embed.data.fields) {
                for (const field of embed.data.fields) {
                    content += `\n**${field.name}**\n${field.value}`;
                }
            }
        }

        const container = new ContainerBuilder()
            .setAccentColor(0x0099FF)
            .addTextDisplayComponents(td => td.setContent(content || 'No content.'))
            .addSeparatorComponents(separator => separator)
            .addActionRowComponents(row => row.setComponents(prevButton, nextButton));

        if (this.categorySelect) {
            container.addActionRowComponents(row => row.setComponents(this.categorySelect!));
        }
        return container;
    }
}
