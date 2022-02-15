import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export type SlashCommandT = {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): Promise<void>;
};
