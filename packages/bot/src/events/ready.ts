import { IEventExecuteParams } from '../interfaces/Event';
import { ApplicationCommandDataResolvable, Guild } from 'discord.js';
import { Schedules } from '../lib/Schedules';
import { Channels } from '../lib/Channels';
import { GuildDataT } from '../interfaces/GuildData';
import axios, { AxiosResponse } from 'axios';
// import watchVoiceChannels from '../lib/watchVoiceChannels';

export = {
  name: 'ready',
  once: true,
  async execute({ commands, client }: IEventExecuteParams): Promise<void> {
    await client.application.commands.set(
      commands as ApplicationCommandDataResolvable[],
    );

    client.user.setActivity('às monitorias!', { type: 'WATCHING' });

    client.guilds.cache.forEach(async (guild: Guild) => {
      const response: AxiosResponse<any, any> = await axios.get(
        process.env.SCHEDULES_URL.replace('{guild}', guild.id),
      );

      const { data }: { data: GuildDataT } = response;

      if (data) {
        const { schedule, channels } = data;

        Schedules.addSchedule(guild.id, schedule);
        Channels.addChannels(guild.id, channels);
      }
    });

    console.log(client.user.username + ' is up and running!');

    // watchVoiceChannels(client, 250);
  },
};
