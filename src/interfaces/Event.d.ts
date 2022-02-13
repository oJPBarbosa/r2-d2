import {
  Collection,
  ApplicationCommandDataResolvable,
  Message,
  Interaction,
} from 'discord.js';
import { CommandT } from './CommandT';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { IClient } from './Client';

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
