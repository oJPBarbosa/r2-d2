import { Client, Collection } from 'discord.js';
import { CommandT, SlashCommandT } from '@/interfaces';

export interface IClient extends Client {
  commands?: Collection<string, CommandT>;
  slashcommands?: Collection<string, SlashCommandT>;
}
