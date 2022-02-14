import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { weekdays } from '../../utils/weekdays';
import { ScheduleT, TutoringT, TutoringTimeT } from '../../interfaces/Schedule';

export default {
  data: new SlashCommandBuilder()
    .setName('hoje')
    .setDescription('📅 Veja as monitorias do dia!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const scheduleURL: string = process.env.SCHEDULES_URL.replace(
      '{guild}',
      interaction.guild.id,
    );

    await axios
      .get(scheduleURL)
      .then(async (response: AxiosResponse<any, any>) => {
        const schedule: ScheduleT = response.data.schedules;

        const weekday: string = weekdays[new Date().getDay()];

        if (!schedule[weekday]) {
          const noTutoringsToday: MessageEmbed = new MessageEmbed()
            .setTitle('ℹ️ Não há monitorias hoje.')
            .setFooter({
              text: 'Comando por ' + interaction.user.tag,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor('#538bbf');

          return interaction.reply({ embeds: [noTutoringsToday] });
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
            text: 'Comando por ' + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#cd3846');

        return interaction.reply({ embeds: [tutorings] });
      })
      .catch(async () => {
        const error: MessageEmbed = new MessageEmbed()
          .setTitle('❌ Houve um erro ao consultar as monitorias de hoje!')
          .setDescription('Tente novamente mais tarde.')
          .setFooter({
            text: 'Comando por ' + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#cd3846');

        await interaction.reply({ embeds: [error] });
      });
  },
};
