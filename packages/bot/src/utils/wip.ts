import { User, MessageEmbed } from 'discord.js';

export default (command: string, user: User): MessageEmbed =>
  new MessageEmbed()
    .setTitle('🚧 O comando `' + command + '` ainda não está disponível.')
    .setFooter({
      text: 'Comando por ' + user.tag,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp()
    .setColor('#f7c85e');
