import { Message } from 'discord.js';

export type CommandData = {
  name: string;
  description: string;
};

export type CommandT = {
  data: CommandData;
  execute(message: Message): Promise<Message<boolean>>;
};
