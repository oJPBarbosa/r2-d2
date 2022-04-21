import { Message } from 'discord.js';

export type CommandDataT = {
  name: string;
  description: string;
};

export type CommandT = {
  data: CommandDataT;
  execute(message: Message): Promise<Message<boolean>>;
};
