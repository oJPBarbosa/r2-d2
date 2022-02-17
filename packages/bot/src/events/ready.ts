import { IEventExecuteParams } from '../interfaces/Event';
import { ApplicationCommandDataResolvable, Guild } from 'discord.js';
import { Schedules } from '../lib/Schedules';
import { Channels } from '../lib/Channels';
import { GuildDataT } from '../interfaces/GuildData';
import axios, { AxiosResponse } from 'axios';
import watchVoiceChannels from '../lib/watchVoiceChannels';

export = {
  name: 'ready',
  once: true,
  async execute({ commands, client }: IEventExecuteParams): Promise<void> {
    await client.application.commands.set(
      commands as ApplicationCommandDataResolvable[],
    );

    client.user.setActivity('às monitorias!', { type: 'WATCHING' });

    client.guilds.cache.forEach(async (guild: Guild) => {
      const guildData: GuildDataT = await axios
        .get(process.env.SCHEDULES_URL.replace('{guild}', guild.id))
        .then((response: AxiosResponse<any, any>) => response.data)
        .catch(() => {});

      if (guildData) {
        const { schedule, channels } = guildData;

        Schedules.addSchedule(guild.id, schedule);
        Channels.addChannels(guild.id, channels);
      }
    });

    console.log(client.user.username + ' is up and running!');

    // watchVoiceChannels(client);
  },
};
