import { Message, MessageEmbed } from 'discord.js';

export default {
  data: {
    name: 'ping',
    description: '🏓 Pong!',
  },
  async execute(message: Message): Promise<void> {
    const packet: Message = await message.channel.send('.');
    packet.delete();

    const ping: MessageEmbed = new MessageEmbed()
      .setTitle('🏓 Pong!')
      .setDescription(
        '└ `' +
          Math.floor(packet.createdTimestamp - message.createdTimestamp) +
          'ms`',
      )
      .setFooter({
        text: 'Requested by ' + message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#dd2e44');

    await message.reply({ embeds: [ping] });
  },
};
