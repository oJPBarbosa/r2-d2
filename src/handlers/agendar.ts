import { SelectMenuInteraction } from 'discord.js';
import date from '../utils/date';
import axios, { AxiosResponse } from 'axios';

export const handleSelectMenuInteraction: Function = async (
  interaction: SelectMenuInteraction,
): Promise<void> => {
  const [guild, weekday] = interaction.values[0].split('-');

  const week: number = date().weekNumber;

  const response: AxiosResponse = await axios.get(
    'pademt.api.jpfb.me/tutorings',
    {
      data: {
        year: date().year,
        week,
      },
    },
  );

  return interaction.update({ embeds: [] });
};
