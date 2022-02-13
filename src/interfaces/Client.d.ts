import { Client, Collection } from 'discord.js';
import { CommandT } from './Command';
import { SlashCommandT } from './SlashCommand';

export interface IClient extends Client {
  commands?: Collection<string, CommandT>;
  slashcommands?: Collection<string, SlashCommandT>;
}
