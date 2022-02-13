import { IEventExecuteParams } from '../interfaces/Event';
import { ApplicationCommandDataResolvable } from 'discord.js';

export = {
  name: 'ready',
  once: true,
  async execute({ commands, client }: IEventExecuteParams): Promise<void> {
    await client.application.commands.set(
      commands as ApplicationCommandDataResolvable[],
    );
    client.user.setActivity('as monitorias!', { type: 'WATCHING' });
    console.log(client.user.username + ' is up and running!');
  },
};
