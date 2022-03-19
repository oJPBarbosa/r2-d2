import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('agendamentos')
    .setDescription('📑 Veja as monitorias agendadas da semana!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: 'Em breve!',
      ephemeral: true,
    });
  },
};
