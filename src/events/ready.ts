import { IEventExecuteParams, GuildDataT } from '../interfaces';
import { ApplicationCommandDataResolvable, Guild } from 'discord.js';
import { Schedules, Channels } from '../lib';
import axios, { AxiosResponse } from 'axios';
// import watchVoiceChannels from '../lib';

export = {
  name: 'ready',
  once: true,
  async execute({ commands, client }: IEventExecuteParams): Promise<void> {
    await client.application.commands.set(
      commands as ApplicationCommandDataResolvable[],
    );

    client.user.setActivity('às monitorias!', { type: 'WATCHING' });

    client.guilds.cache.forEach(async (guild: Guild) => {
      const response: AxiosResponse<any, any> = await axios.get(`
        ${process.env.TUTORING_DEPARTMENTS_DATA_URL}/${guild.id}.json`);

      const { data }: { data: GuildDataT } = response;

      if (data) {
        const { schedule, channels } = data;

        Schedules.addSchedule(guild.id, schedule);
        Channels.addChannels(guild.id, channels);
      }
    });

    console.log(
      `${new Date().toUTCString()} [LOG]: [${client.user.tag} - ${
        client.user.id
      }] is up and running!`,
    );

    // watchVoiceChannels(client, 250);
  },
};
