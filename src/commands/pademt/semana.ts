import {
  Message,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  DMChannel,
} from 'discord.js';
import { weekdays, dias } from '../../utils';
import { MessageDelete, CommandLog } from '../../services';

export default {
  data: {
    name: 'semana',
    description: '🗓️ Veja as monitorias da semana!',
  },
  async execute(message: Message): Promise<void> {
    const options: MessageSelectOptionData[] = weekdays.map(
      (weekday: string, index: number) => ({
        label: dias[index].charAt(0).toUpperCase() + dias[index].slice(1),
        value: `${message.guild.id}-${weekday}`,
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
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setTimestamp()
      .setColor('#cd3846');

    try {
      const dm: DMChannel = await message.author.createDM();
      await dm.send({ embeds: [embed], components: [row] });
    } catch {
      const reply: Message = await message.reply(
        'Verifique a privacidade de sua DM para receber o cronograma semanal de forma particular.',
      );

      MessageDelete.append(reply);
    }

    CommandLog.append(message);

    await message.delete();
  },
};
