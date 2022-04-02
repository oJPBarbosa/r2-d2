import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { CurrentTutoringT } from '../../interfaces/Schedules';
import { Schedules } from '../../lib/Schedules';

export default {
  data: new SlashCommandBuilder()
    .setName('agora')
    .setDescription('⏰ Veja as monitorias de agora!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const tutorings: CurrentTutoringT[] = Schedules.getCurrentTutorings(
      interaction.guild.id,
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

      await interaction.reply({ embeds: [embed] });
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
            text: 'Comando por ' + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#538bbf');

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed: MessageEmbed = new MessageEmbed()
          .setTitle('⏰ Monitorias agora:')
          .setFields(fields)
          .setFooter({
            text: 'Comando por ' + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#f7c85e');

        await interaction.reply({ embeds: [embed] });
      }
    }
  },
};
