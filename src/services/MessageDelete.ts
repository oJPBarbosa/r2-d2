import { IClient } from '../interfaces';
import { client as c } from '..';
import { Message, TextChannel } from 'discord.js';

export class MessageDelete {
  private static client: IClient = c;

  private static messages: Message[] = [];

  public static append(message: Message): void {
    const guilds: string[] =
      process.env.TUTORING_DEPARTMENTS_WITH_MESSAGE_DELETE_SERVICE.split(',');

    if (guilds.includes(message.guild.id)) {
      this.messages.push(message);
      this.run();
    }
  }

  private static run(): void {
    setInterval((): void => {
      this.messages.forEach((message: Message) => {
        if (message.createdTimestamp + 300 * 1000 < Date.now()) {
          this.delete(message);
        }
      });
    }, 10000);
  }

  private static async delete(message: Message): Promise<void> {
    await (
      this.client.guilds.cache
        .get(message.guild.id)
        .channels.cache.get(message.channel.id) as TextChannel
    ).messages
      .fetch(message.id)
      .then((m: Message) => m.delete());

    this.messages = this.messages.filter((m: Message) => m.id !== message.id);
  }
}
