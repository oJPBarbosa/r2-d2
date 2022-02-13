import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { weekdays } from '../../utils/weekdays';
import { ScheduleT, TutoringT, TutoringTimeT } from '../../interfaces/Schedule';

export default {
  data: {
    name: 'hoje',
    description: '📅 Veja as monitorias do dia!',
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

          let tutorings: string = '';
          tutoring.tutoring.forEach((t: TutoringTimeT) => {
            tutorings += `- **${t.from[0].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            })}:${t.from[1].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            })}** às **${t.to[0].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            })}:${t.to[1].toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
            })}**\n`;
          });

          schedules.push({
            name: tutor,
            value: tutorings,
          });
        });

        const tutorings: MessageEmbed = new MessageEmbed()
          .setTitle('📅 Monitorias hoje:')
          .setFields(schedules)
          .setFooter({
            text: 'Comando por ' + message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#cd3846');

        return message.reply({ embeds: [tutorings] });
      })
      .catch(async () => {
        const error: MessageEmbed = new MessageEmbed()
          .setTitle('❌ Houve um erro consultar as monitorias de hoje!')
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
