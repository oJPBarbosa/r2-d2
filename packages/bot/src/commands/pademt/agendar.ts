// todo
// prisma?
import { Message } from 'discord.js';
import wip from '../../utils/wip';

export default {
  data: {
    name: 'agendar',
    description: '📋 Agende uma monitoria!',
  },
  async execute(message: Message): Promise<void> {
    await message.reply({ embeds: [wip('agendar', message.author)] });
  },
};
