// todo
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import wip from '../../utils/wip';

export default {
  data: new SlashCommandBuilder()
    .setName('agendamentos')
    .setDescription('📑 Veja os agendamentos!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [wip('agendamentos', interaction.user)],
    });
  },
};
