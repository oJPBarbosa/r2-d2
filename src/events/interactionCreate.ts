import { IEventExecuteParams } from '../interfaces/Event';
import { APIMessage } from 'discord-api-types';
import { Message, CommandInteraction, SelectMenuInteraction } from 'discord.js';
import { SlashCommandT } from '../interfaces/SlashCommand';
import { handleSelectMenuInteraction } from '../handlers/semana';

export = {
  name: 'interactionCreate',
  async execute({
    args,
    client,
  }: IEventExecuteParams): Promise<void | APIMessage | Message<boolean>> {
    const interaction: CommandInteraction | SelectMenuInteraction = args[0];

    if (interaction.isCommand()) {
      const slashcommand: SlashCommandT = client.slashcommands.get(
        interaction.commandName,
      );

      if (!slashcommand) {
        return;
      }

      return slashcommand.execute(interaction);
    }

    if (interaction.isSelectMenu()) {
      if (interaction.customId === 'semana') {
        handleSelectMenuInteraction(interaction);
      }
    }
  },
};
