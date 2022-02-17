import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { NowTutoringsT } from '../../interfaces/Schedules';
import { Schedules } from '../../lib/Schedules';

export default {
  data: new SlashCommandBuilder()
    .setName('agora')
    .setDescription('⏰ Veja as monitorias de agora!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const tutorings: NowTutoringsT[] = Schedules.getNowTutorings(
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

      return interaction.reply({ embeds: [embed] });
    }

    const fields: EmbedFieldData[] = [];

    tutorings.forEach((t: NowTutoringsT) => {
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

    if (!fields) {
      const embed: MessageEmbed = new MessageEmbed()
        .setTitle('ℹ️ Não há monitorias agora.')
        .setFooter({
          text: 'Comando por ' + interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('#538bbf');

      return interaction.reply({ embeds: [embed] });
    }

    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('⏰ Monitorias agora:')
      .setFields(fields)
      .setFooter({
        text: 'Comando por ' + interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#f7c85e');

    return interaction.reply({ embeds: [embed] });
  },
};
