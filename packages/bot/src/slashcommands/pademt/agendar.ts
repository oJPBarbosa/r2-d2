// prisma?
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('agendar')
    .setDescription('📋 Agende uma monitoria!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [] });
  },
};
