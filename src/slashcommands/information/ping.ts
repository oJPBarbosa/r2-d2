import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { CommandLog } from '../../services';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping? 🏓 Pong!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const packet: Message = await interaction.channel.send('.');
    await packet.delete();

    const embed: MessageEmbed = new MessageEmbed()
      .setTitle('🏓 Pong!')
      .setDescription(
        '└ `' +
          Math.floor(packet.createdTimestamp - interaction.createdTimestamp) +
          'ms`',
      )
      .setFooter({
        text: 'Comando por ' + interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor('#dd2e44');

    await interaction.reply({ embeds: [embed], ephemeral: true });

    CommandLog.append(interaction);
  },
};
