import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import { CurrentTutoringT } from '../../interfaces';
import { Schedules } from '../../lib';

export default {
  data: {
    name: 'agora',
    description: '⏰ Veja as monitorias de agora!',
  },
  async execute(message: Message): Promise<void> {
    const tutorings: CurrentTutoringT[] = Schedules.getCurrentTutorings(
      message.guild.id,
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

      tutorings.forEach((t: CurrentTutoringT) => {
        fields.push({
          name: t.tutor.name,
          value:
            '- **`' +
            t.tutoring.from[0].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            ':' +
            t.tutoring.from[1].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            '`** às **`' +
            t.tutoring.to[0].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            ':' +
            t.tutoring.to[1].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            }) +
            '`**\n',
        });
      });

      if (fields.length === 0) {
        const embed: MessageEmbed = new MessageEmbed()
          .setTitle('ℹ️ Não há monitorias agora.')
          .setFooter({
            text: 'Comando por ' + message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#538bbf');

        await message.reply({ embeds: [embed] });
      } else {
        const embed: MessageEmbed = new MessageEmbed()
          .setTitle('⏰ Monitorias agora:')
          .setFields(fields)
          .setFooter({
            text: 'Comando por ' + message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#f7c85e');

        await message.reply({ embeds: [embed] });
      }
    }
  },
};
