import { TutoringTimeT } from '../../interfaces/GuildData.d';
import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import { TutoringT } from '../../interfaces/GuildData';
import { Schedules } from '../../lib/Schedules';
import { weekdays } from '../../utils/weekdays';
import date from '../../utils/date';

export default {
  data: {
    name: 'hoje',
    description: '📅 Veja as monitorias do dia!',
  },
  async execute(message: Message): Promise<void> {
    const tutorings: TutoringT[] = Schedules.getDayTutorings(
      message.guild.id,
      weekdays[date().weekday],
    );

    if (!tutorings) {
      const embed: MessageEmbed = new MessageEmbed()
        .setTitle('ℹ️ Não há monitorias hoje.')
        .setFooter({
          text: 'Comando por ' + message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#538bbf');

      await message.reply({ embeds: [embed] });
    } else {
      const fields: EmbedFieldData[] = [];

      tutorings.forEach((t: TutoringT) => {
        let tts: string = '';

        t.tutoring.forEach((tt: TutoringTimeT) => {
          tts +=
            '- **`' +
            tt.from[0].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            ':' +
            tt.from[1].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            '`** às **`' +
            tt.to[0].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            ':' +
            tt.to[1].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            '`**\n';
        });

        fields.push({
          name: t.tutor.name,
          value: tts,
        });
      });

      const embed: MessageEmbed = new MessageEmbed()
        .setTitle('📅 Monitorias hoje:')
        .setFields(fields)
        .setFooter({
          text: 'Comando por ' + message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#cd3846');

      await message.reply({ embeds: [embed] });
    }
  },
};
