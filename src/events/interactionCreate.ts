import { IEventExecuteParams, SlashCommandT } from '@/interfaces';
import { APIMessage } from 'discord-api-types';
import {
  Message,
  CommandInteraction,
  SelectMenuInteraction,
  MessageEmbed,
} from 'discord.js';
import {
  semanaHandleSelectMenuInteraction,
  agendarHandleSelectMenuInteraction,
} from '@/handlers';

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

      if (!interaction.guildId) {
        const error: MessageEmbed = new MessageEmbed()
          .setTitle('❌ Não é possível executar comandos na DM!')
          .setFooter({
            text: 'Comando por ' + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setColor('#cd3846');

        return interaction.reply({ embeds: [error] });
      }

      return slashcommand.execute(interaction);
    }

    if (interaction.isSelectMenu()) {
      if (interaction.customId === 'semana') {
        return semanaHandleSelectMenuInteraction(interaction);
      }
      if (interaction.customId === 'agendar') {
        return agendarHandleSelectMenuInteraction(interaction);
      }
    }
  },
};
