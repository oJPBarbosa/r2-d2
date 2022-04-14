import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { CommandT } from '../../interfaces';

export default {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Precisando de uma ajudinha? 🙋'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const dir: string = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

    const commands: EmbedFieldData[] = [];
    readdirSync(join(process.cwd(), dir, 'commands')).forEach(
      (category: string) => {
        readdirSync(join(process.cwd(), dir, 'commands', category)).forEach(
          (file: string) => {
            const command: CommandT = require(join(
              process.cwd(),
              dir,
              'commands',
              category,
              file,
            )).default;

            if (
              command.data.name !== 'ajuda' &&
              command.data.name !== 'agendamentos' && // temporary
              command.data.name !== 'agendar' // temporary
            ) {
              commands.push({
                name: '`' + command.data.name + '`',
                value: command.data.description,
              });
            }
          },
        );
      },
    );

    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('🙋 A ajuda chegou!')
      .addFields(commands)
      .setFooter({
        text: 'Comando por ' + interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#e58032');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
