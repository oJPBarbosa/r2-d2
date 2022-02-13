import { Message, MessageEmbed } from 'discord.js';

export default {
  data: {
    name: 'agenda',
    description: '📑 Veja a agenda das monitorias!',
  },
  async execute(message: Message): Promise<void> {
    await message.reply({ embeds: [] });
  },
};
