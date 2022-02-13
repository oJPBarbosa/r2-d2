import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { weekdays } from '../../utils/weekdays';
import { ScheduleT, TutoringT, TutoringTimeT } from '../../interfaces/Schedule';

export default {
  data: {
    name: 'agora',
    description: '⏰ Veja as monitorias de agora!',
  },
  async execute(message: Message): Promise<void> {
    const scheduleURL: string = process.env.SCHEDULES_URL.replace(
      '{guild}',
      message.guild.id,
    );

    await axios
      .get(scheduleURL)
      .then(async (response: AxiosResponse<any, any>) => {
        const schedule: ScheduleT = response.data;

        const weekday: string = weekdays[new Date().getDay()];

        if (!schedule[weekday]) {
          const noTutoringsToday: MessageEmbed = new MessageEmbed()
            .setTitle('ℹ️ Não há monitorias hoje.')
            .setFooter({
              text: 'Comando por ' + message.author.tag,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor('#538bbf');

          return message.reply({ embeds: [noTutoringsToday] });
        }

        const schedules: EmbedFieldData[] = [];
        schedule[weekday].forEach((tutoring: TutoringT) => {
          const tutor: string = tutoring.tutor.name;

          tutoring.tutoring.forEach((t: TutoringTimeT) => {
            const now: Date = new Date();

            const tutoringFromDate: Date = new Date();
            tutoringFromDate.setHours(t.from[0]);
            tutoringFromDate.setMinutes(t.from[1]);

            const tutoringToDate: Date = new Date();
            tutoringToDate.setHours(t.to[0]);
            tutoringToDate.setMinutes(t.to[1]);

            if (
              now.getTime() >= tutoringFromDate.getTime() &&
              now.getTime() <= tutoringToDate.getTime()
            ) {
              schedules.push({
                name: tutor,
                value: `- **${t.from[0].toLocaleString('pt-BR', {
                  minimumIntegerDigits: 2,
                })}:${t.from[1].toLocaleString('pt-BR', {
                  minimumIntegerDigits: 2,
                })}** às **${t.to[0].toLocaleString('pt-BR', {
                  minimumIntegerDigits: 2,
                })}:${t.to[1].toLocaleString('pt-BR', {
                  minimumIntegerDigits: 2,
                })}**`,
              });
            }
          });
        });

        if (!schedules) {
          const noTutorings: MessageEmbed = new MessageEmbed()
            .setTitle('ℹ️ Não há monitorias agora.')
            .setFooter({
              text: 'Comando por ' + message.author.tag,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor('#538bbf');

          return message.reply({ embeds: [noTutorings] });
        }

        const tutorings: MessageEmbed = new MessageEmbed()
          .setTitle('⏰ Monitorias agora:')
          .setFields(schedules)
          .setFooter({
            text: 'Comando por ' + message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#f7c85e');

        return message.reply({ embeds: [tutorings] });
      })
      .catch(async () => {
        const error: MessageEmbed = new MessageEmbed()
          .setTitle('❌ Houve um erro ao consultar as monitorias de agora!')
          .setDescription('Tente novamente mais tarde.')
          .setFooter({
            text: 'Comando por ' + message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#cd3846');

        await message.reply({ embeds: [error] });
      });
  },
};
