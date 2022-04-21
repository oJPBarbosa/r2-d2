import { CommandLogT } from '../interfaces';
import { Message, Interaction, GuildChannel } from 'discord.js';

export class CommandLog {
  private static commands: CommandLogT[] = [];

  private static count: number = 0;

  public static append(command: Message | Interaction): void {
    const c: CommandLogT = {
      id: command.id,
      timestamp: command.createdAt,
      name: null,
      author: {
        id: null,
        tag: null,
      },
      guild: {
        id: command.guild.id,
        name: command.guild.name,
      },
      channel: {
        id: command.channel.id,
        name: (command.channel as GuildChannel).name,
      },
    };

    if (command instanceof Message) {
      c.name = command.content.replace(process.env.PREFIX, '');
      c.author = {
        id: command.author.id,
        tag: command.author.tag,
      };
    } else if (command instanceof Interaction) {
      c.name = (command.toJSON() as any).commandName;
      c.author = {
        id: command.user.id,
        tag: command.user.tag,
      };
    }

    this.commands.push(c);
    this.run();
  }

  private static run(): void {
    setInterval((): void => {
      this.commands.forEach((command: CommandLogT) => {
        this.log(command);
      });
    }, 10000);
  }

  private static async log(command: CommandLogT): Promise<void> {
    console.log(
      `${command.timestamp.toUTCString()} [COMMAND]: [${command.name} - ${
        command.id
      }] by [${command.author.tag} - ${command.author.id}] at [${
        command.guild.name
      } - ${command.guild.id}] in [${command.channel.name} - ${
        command.channel.id
      }]`,
    );

    this.count++;
    console.log(`${new Date().toUTCString()} [COUNT]: ${this.count}`);

    this.commands = this.commands.filter(
      (c: CommandLogT) => c.id !== command.id,
    );
  }
}
