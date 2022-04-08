import {
  SelectMenuInteraction,
  EmbedFieldData,
  MessageEmbed,
} from 'discord.js';
import { TutoringT, TutoringTimeT } from '@/interfaces';
import { Schedules } from '@/lib';
import { weekdays, dias } from '@/utils';

export const semanaHandleSelectMenuInteraction: Function = async (
  interaction: SelectMenuInteraction,
): Promise<void> => {
  const [guild, weekday] = interaction.values[0].split('-');

  const tutorings: TutoringT[] = Schedules.getDayTutorings(guild, weekday);

  if (!tutorings) {
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle(`ℹ️ Não há monitorias ${dias[weekdays.indexOf(weekday)]}.`)
      .setFooter({
        text: interaction.client.guilds.cache.get(guild).name,
        iconURL: interaction.client.guilds.cache.get(guild).iconURL(),
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
    .setTitle(`📅 Monitorias ${dias[weekdays.indexOf(weekday)]}:`)
    .setFields(fields)
    .setFooter({
      text: interaction.client.guilds.cache.get(guild).name,
      iconURL: interaction.client.guilds.cache.get(guild).iconURL(),
    })
    .setTimestamp()
    .setColor('#cd3846');

  return interaction.update({ embeds: [embed] });
};
