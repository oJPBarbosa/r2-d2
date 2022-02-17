import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { TutoringT, TutoringTimeT } from '../../interfaces/GuildData';
import { Schedules } from '../../lib/Schedules';
import { weekdays } from '../../utils/weekdays';

export default {
  data: new SlashCommandBuilder()
    .setName('hoje')
    .setDescription('📅 Veja as monitorias do dia!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const tutorings: TutoringT[] = Schedules.getDayTutorings(
      interaction.guild.id,
      weekdays[new Date().getDay()],
    );

    if (!tutorings) {
      const embed: MessageEmbed = new MessageEmbed()
        .setTitle('ℹ️ Não há monitorias hoje.')
        .setFooter({
          text: 'Comando por ' + interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#538bbf');

      return interaction.reply({ embeds: [embed] });
    }

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
        text: 'Comando por ' + interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#cd3846');

    return interaction.reply({ embeds: [embed] });
  },
};
