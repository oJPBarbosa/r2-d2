import { Message, MessageEmbed } from 'discord.js';

export default {
  data: {
    name: 'agendamentos',
    description: '📑 Veja os agendamentos!',
  },
  async execute(message: Message): Promise<void> {
    await message.reply({ embeds: [] });
  },
};
