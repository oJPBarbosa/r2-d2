import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  DMChannel,
} from 'discord.js';
import { weekdays, translatedWeekdays } from '../../utils/weekdays';

export default {
  data: new SlashCommandBuilder()
    .setName('semana')
    .setDescription('🗓️ Veja as monitorias da semana!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const options: MessageSelectOptionData[] = weekdays.map(
      (weekday: string, index: number) => ({
        label:
          translatedWeekdays[index].charAt(0).toUpperCase() +
          translatedWeekdays[index].slice(1),
        value: `${interaction.guild.id}-${weekday}`,
      }),
    );

    const row: MessageActionRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('semana')
        .setPlaceholder('Nenhum dia selecionado')
        .addOptions(options),
    );

    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('🗓️ Selecione um dia da semana:')
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTimestamp()
      .setColor('#cd3846');

    try {
      const dm: DMChannel = await interaction.user.createDM();
      await dm.send({ embeds: [embed], components: [row] });

      await interaction.reply('🗓️');
    } catch {
      await interaction.reply({
        content:
          'Verifique a privacidade de sua DM para receber o cronograma semanal de forma particular.',
        ephemeral: true,
      });

      await interaction.channel.send({ embeds: [embed], components: [row] });
    }
  },
};
