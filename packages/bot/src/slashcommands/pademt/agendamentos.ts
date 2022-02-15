import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('agendamentos')
    .setDescription('📑 Veja os agendamentos!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [] });
  },
};
