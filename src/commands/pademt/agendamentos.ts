import { Message } from 'discord.js';

export default {
  data: {
    name: 'agendamentos',
    description: '📑 Veja as monitorias agendadas da semana!',
  },
  async execute(message: Message): Promise<void> {
    await message.reply('Em breve!');
  },
};
