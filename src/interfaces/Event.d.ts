import { Collection, ApplicationCommandDataResolvable } from 'discord.js';
import { CommandT, IClient } from '@/interfaces';

export interface IEventExecuteParams {
  args: [any];
  commands?: Collection<string, CommandT> | ApplicationCommandDataResolvable[];
  client?: IClient;
}

export type EventT = {
  name: string;
  once?: boolean;
  execute({ commands, client }: IEventExecuteParams): void;
};
