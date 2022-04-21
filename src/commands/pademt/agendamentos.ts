import { Message } from 'discord.js';
import { CommandLog } from '../../services';

export default {
  data: {
    name: 'agendamentos',
    description: '📑 Veja as monitorias agendadas da semana!',
  },
  async execute(message: Message): Promise<void> {
    // await message.reply('Em breve!');

    CommandLog.append(message);

    await message.delete();
  },
};
