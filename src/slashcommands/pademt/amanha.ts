import { SlashCommandBuilder } from '@discordjs/builders';
import { TutoringTimeT } from '../../interfaces/GuildData.d';
import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { TutoringT } from '../../interfaces/GuildData';
import { Schedules } from '../../lib/Schedules';
import { weekdays } from '../../utils/weekdays';
import date from '../../utils/date';

export default {
  data: new SlashCommandBuilder()
    .setName('amanha')
    .setDescription('🌅 Veja as monitorias de amanhã!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const tutorings: TutoringT[] = Schedules.getDayTutorings(
      interaction.guild.id,
      weekdays[date().weekday + 1 > 6 ? 0 : date().weekday + 1],
    );

    if (!tutorings) {
      const embed: MessageEmbed = new MessageEmbed()
        .setTitle('ℹ️ Não há monitorias amanhã.')
        .setFooter({
          text: 'Comando por ' + interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#538bbf');

      await interaction.reply({ embeds: [embed] });
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
          text: 'Comando por ' + interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#fcc140');

      await interaction.reply({ embeds: [embed] });
    }
  },
};
