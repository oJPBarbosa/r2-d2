import {
  Message,
  MessageEmbed,
  DMChannel,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
} from 'discord.js';
import { Schedules } from '../../lib';
import { weekdays, dias } from '../../utils';
import { CommandLog } from '../../services';

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
        dias[weekdays.indexOf(day)].charAt(0).toUpperCase() +
        dias[weekdays.indexOf(day)].slice(1),
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

    // await message.reply('Em breve!');

    CommandLog.append(message);
  },
};
