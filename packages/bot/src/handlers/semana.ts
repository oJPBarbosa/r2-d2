import {
  SelectMenuInteraction,
  EmbedFieldData,
  MessageEmbed,
} from 'discord.js';
import { TutoringT, TutoringTimeT } from '../interfaces/GuildData';
import { Schedules } from '../lib/Schedules';
import { weekdays, translatedWeekdays } from '../utils/weekdays';

export const handleSelectMenuInteraction: Function = async (
  interaction: SelectMenuInteraction,
): Promise<void> => {
  const [guild, weekday] = interaction.values[0].split('-');

  const tutorings: TutoringT[] = Schedules.getDayTutorings(guild, weekday);

  if (!tutorings) {
    const embed: MessageEmbed = new MessageEmbed()
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

    return interaction.update({ embeds: [embed] });
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
    .setTitle(`📅 Monitorias ${translatedWeekdays[weekdays.indexOf(weekday)]}:`)
    .setDescription(interaction.client.guilds.cache.get(guild).name)
    .setFields(fields)
    .setFooter({
      text: 'Comando por ' + interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setColor('#cd3846');

  return interaction.update({ embeds: [embed] });
};
