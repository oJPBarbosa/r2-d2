import {
  SelectMenuInteraction,
  EmbedFieldData,
  MessageEmbed,
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { ScheduleT, TutoringT, TutoringTimeT } from '../interfaces/GuildData';
import { weekdays, translatedWeekdays } from '../utils/weekdays';

export const handleSelectMenuInteraction: Function = async (
  interaction: SelectMenuInteraction,
): Promise<void> => {
  const scheduleURL: string = process.env.SCHEDULES_URL.replace(
    '{guild}',
    interaction.guild.id,
  );

  await axios
    .get(scheduleURL)
    .then(async (response: AxiosResponse<any, any>) => {
      const schedule: ScheduleT = response.data.schedules;

      const weekday: string = interaction.values[0];

      const schedules: EmbedFieldData[] = [];

      if (!schedule[weekday]) {
        const noTutorings: MessageEmbed = new MessageEmbed()
          .setTitle(
            `ℹ️ Não há monitorias ${
              translatedWeekdays[weekdays.indexOf(weekday)]
            }.`,
          )
          .setFooter({
            text: 'Comando por ' + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#538bbf');

        return interaction.update({ embeds: [noTutorings] });
      }

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
        .setTitle(
          `📅 Monitorias ${translatedWeekdays[weekdays.indexOf(weekday)]}:`,
        )
        .setFields(schedules)
        .setFooter({
          text: 'Comando por ' + interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#cd3846');

      return interaction.update({ embeds: [tutorings] });
    })
    .catch(async () => {
      const error: MessageEmbed = new MessageEmbed()
        .setTitle('❌ Houve um erro ao consultar as monitorias da semana!')
        .setDescription('Tente novamente mais tarde.')
        .setFooter({
          text: 'Comando por ' + interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#cd3846');

      await interaction.update({ embeds: [error] });
    });
};
