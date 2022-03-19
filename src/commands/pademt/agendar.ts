import { SlashCommandBuilder } from '@discordjs/builders';
import {
  Message,
  MessageEmbed,
  DMChannel,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
} from 'discord.js';
import { Schedules } from '../../lib/Schedules';
import { weekdays, translatedWeekdays } from '../../utils/weekdays';

export default {
  data: {
    name: 'agendar',
    description: '📋 Agende uma monitoria!',
  },
  async execute(message: Message): Promise<void> {
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('📋 Agende uma monitoria!')
      .setDescription('Selecione um dia da semana:')
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setTimestamp()
      .setColor('#ae7545');

    const days: string[] = Object.keys(
      Schedules.getTutorings(message.guild.id),
    );

    const options: MessageSelectOptionData[] = days.map((day: string) => ({
      label:
        translatedWeekdays[weekdays.indexOf(day)].charAt(0).toUpperCase() +
        translatedWeekdays[weekdays.indexOf(day)].slice(1),
      value: `${message.guild.id}-${day}`,
    }));

    const row: MessageActionRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('agendar')
        .setPlaceholder('Nenhum dia selecionado')
        .addOptions(options),
    );

    const dm: DMChannel = await message.author.createDM();

    // dm.send({ embeds: [embed], components: [row] });

    await message.reply('Em breve!');
  },
};
