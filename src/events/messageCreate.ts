import { IEventExecuteParams, CommandT } from '@/interfaces';
import { APIMessage } from 'discord-api-types';
import { Message } from 'discord.js';

export = {
  name: 'messageCreate',
  async execute({
    args,
    client,
  }: IEventExecuteParams): Promise<void | APIMessage | Message<boolean>> {
    const message: Message = args[0];

    if (
      message.author.bot ||
      !message.guild ||
      !message.content.startsWith(process.env.PREFIX)
    ) {
      return;
    }

    const commandName: string = message.content
      .slice(process.env.PREFIX.length)
      .trim()
      .split(' ')[0];

    const command: CommandT = client.commands.get(commandName);

    if (!command) {
      return;
    }

    await command.execute(message);
  },
};
