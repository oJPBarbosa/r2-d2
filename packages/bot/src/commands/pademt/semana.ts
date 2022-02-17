import {
  Message,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  DMChannel,
} from 'discord.js';
import { weekdays, translatedWeekdays } from '../../utils/weekdays';

export default {
  data: {
    name: 'semana',
    description: '🗓️ Veja as monitorias da semana!',
  },
  async execute(message: Message): Promise<void> {
    const options: MessageSelectOptionData[] = weekdays.map(
      (weekday: string, index: number) => ({
        label:
          translatedWeekdays[index].charAt(0).toUpperCase() +
          translatedWeekdays[index].slice(1),
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
        text: 'Comando por ' + message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#cd3846');

    const dm: DMChannel = await message.author.createDM();
    await dm.send({ embeds: [embed], components: [row] });

    await message.delete();
  },
};
