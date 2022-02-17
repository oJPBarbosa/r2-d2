// todo
// prisma?
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import wip from '../../utils/wip';

export default {
  data: new SlashCommandBuilder()
    .setName('agendar')
    .setDescription('📋 Agende uma monitoria!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [wip('agendar', interaction.user)],
      ephemeral: true,
    });
  },
};
