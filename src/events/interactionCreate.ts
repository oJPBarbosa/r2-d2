import { IEventExecuteParams } from '../interfaces/Event';
import { APIMessage } from 'discord-api-types';
import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandT } from '../interfaces/SlashCommand';

export = {
  name: 'interactionCreate',
  async execute({
    args,
    client,
  }: IEventExecuteParams): Promise<void | APIMessage | Message<boolean>> {
    const interaction: CommandInteraction = args[0];

    if (!interaction.isCommand()) {
      return;
    }

    const slashcommand: SlashCommandT = client.slashcommands.get(
      interaction.commandName,
    );

    if (!slashcommand) {
      return;
    }

    return slashcommand.execute(interaction);
  },
};
