import { SelectMenuInteraction } from 'discord.js';
import axios, { AxiosResponse } from 'axios';

export const handleSelectMenuInteraction: Function = async (
  interaction: SelectMenuInteraction,
): Promise<void> => {
  const [guild, weekday] = interaction.values[0].split('-');

  const week: number = Math.ceil(
    (new Date().getDay() +
      1 +
      Math.floor(
        (new Date().getTime() -
          new Date(new Date().getFullYear(), 0, 1).getTime()) /
          (24 * 60 * 60 * 1000),
      )) /
      7,
  );

  const response: AxiosResponse = await axios.get('pademt.api.jpfb.me/tutorings', {
    data: {
      year: new Date().getFullYear(),
      week,
    },
  });

  return interaction.update({ embeds: [] });
};
