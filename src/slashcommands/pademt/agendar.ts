import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  MessageEmbed,
  DMChannel,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
} from 'discord.js';
import { Schedules } from '@/lib';
import { weekdays, dias } from '@/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('agendar')
    .setDescription('📋 Agende uma monitoria!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('📋 Agende uma monitoria!')
      .setDescription('Selecione um dia da semana:')
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTimestamp()
      .setColor('#ae7545');

    const days: string[] = Object.keys(
      Schedules.getTutorings(interaction.guild.id),
    );

    const options: MessageSelectOptionData[] = days.map((day: string) => ({
      label:
        dias[weekdays.indexOf(day)].charAt(0).toUpperCase() +
        dias[weekdays.indexOf(day)].slice(1),
      value: `${interaction.guild.id}-${day}`,
    }));

    const row: MessageActionRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('agendar')
        .setPlaceholder('Nenhum dia selecionado')
        .addOptions(options),
    );

    const dm: DMChannel = await interaction.user.createDM();

    // dm.send({ embeds: [embed], components: [row] });

    await interaction.reply({
      content: 'Em breve!',
      ephemeral: true,
    });
  },
};
