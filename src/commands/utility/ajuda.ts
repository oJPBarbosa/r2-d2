import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { CommandT } from '../../interfaces/Command';

export default {
  data: {
    name: 'ajuda',
    description: 'Precisando de uma ajudinha? 🙋',
  },
  async execute(message: Message): Promise<void> {
    const dir: string = process.env.NODE_ENV === 'production' ? 'build' : 'src';

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

            if (command.data.name !== 'ajuda') {
              commands.push({
                name: '`' + command.data.name + '`',
                value: command.data.description,
              });
            }
          },
        );
      },
    );

    const help: MessageEmbed = new MessageEmbed()
      .setTitle('🙋 A ajuda chegou!')
      .addFields(commands)
      .setFooter({
        text: 'Comando por ' + message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#e58032');

    await message.reply({ embeds: [help] });
  },
};