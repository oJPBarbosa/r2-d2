// todo
import { Message } from 'discord.js';
import wip from '../../utils/wip';

export default {
  data: {
    name: 'agendamentos',
    description: '📑 Veja os agendamentos!',
  },
  async execute(message: Message): Promise<void> {
    await message.reply({ embeds: [wip('agendamentos', message.author)] });
  },
};
