// prisma?
import { Message, MessageEmbed } from 'discord.js';

export default {
  data: {
    name: 'agendar',
    description: '📋 Agende uma monitoria!',
  },
  async execute(message: Message): Promise<void> {
    await message.reply({ embeds: [] });
  },
};
