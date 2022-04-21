import { Message, MessageEmbed } from 'discord.js';
import { CommandLog, MessageDelete } from '../../services';

export default {
  data: {
    name: 'ping',
    description: '🏓 Pong!',
  },
  async execute(message: Message): Promise<void> {
    const packet: Message = await message.channel.send('.');
    await packet.delete();

    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('🏓 Pong!')
      .setDescription(
        '└ `' +
          Math.floor(packet.createdTimestamp - message.createdTimestamp) +
          'ms`',
      )
      .setFooter({
        text: 'Comando por ' + message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#dd2e44');

    const reply: Message = await message.reply({ embeds: [embed] });

    CommandLog.append(message);
    MessageDelete.append(reply);

    await message.delete();
  },
};
