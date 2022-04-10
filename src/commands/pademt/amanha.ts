import { TutoringT, TutoringTimeT } from '../../interfaces';
import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import { Schedules } from '../../lib';
import { weekdays, date } from '../../utils';

export default {
  data: {
    name: 'amanha',
    description: '🌅 Veja as monitorias de amanhã!',
  },
  async execute(message: Message): Promise<void> {
    const tutorings: TutoringT[] = Schedules.getDayTutorings(
      message.guild.id,
      weekdays[date().weekday + 1 > 7 ? 0 : date().weekday + 1],
    );

    if (!tutorings) {
      const embed: MessageEmbed = new MessageEmbed()
        .setTitle('ℹ️ Não há monitorias amanhã.')
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
        .setTitle('🌅 Monitorias amanhã:')
        .setFields(fields)
        .setFooter({
          text: 'Comando por ' + message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#fcc140');

      await message.reply({ embeds: [embed] });
    }
  },
};
