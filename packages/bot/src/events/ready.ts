import { IEventExecuteParams } from '../interfaces/Event';
import { ApplicationCommandDataResolvable } from 'discord.js';
import { watchVoiceChannels } from '../lib/watchVoiceChannels';

export = {
  name: 'ready',
  once: true,
  async execute({ commands, client }: IEventExecuteParams): Promise<void> {
    await client.application.commands.set(
      commands as ApplicationCommandDataResolvable[],
    );
    client.user.setActivity('às monitorias!', { type: 'WATCHING' });

    console.log(client.user.username + ' is up and running!');

    setInterval(() => watchVoiceChannels(client), 10000);
  },
};
