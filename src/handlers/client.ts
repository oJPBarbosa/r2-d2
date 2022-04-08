import { IClient, CommandT, SlashCommandT, EventT } from '@/interfaces';
import { readdirSync } from 'fs';
import { join } from 'path';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';

export const handler: Function = async (client: IClient): Promise<void> => {
  const dir: string = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

  readdirSync(join(process.cwd(), dir, 'commands')).forEach(
    (category: string) => {
      readdirSync(join(process.cwd(), dir, 'commands', category)).forEach(
        (file: string) => {
          const command: CommandT = require(join(
            process.cwd(),
            dir,
            'commands',
            category,
            file,
          )).default;

          client.commands.set(command.data.name, command);
        },
      );
    },
  );

  const slashcommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  readdirSync(join(process.cwd(), dir, 'slashcommands')).forEach(
    (category: string) => {
      readdirSync(join(process.cwd(), dir, 'slashcommands', category)).forEach(
        (file: string) => {
          const slashcommand: SlashCommandT = require(join(
            process.cwd(),
            dir,
            'slashcommands',
            category,
            file,
          )).default;

          client.slashcommands.set(slashcommand.data.name, slashcommand);
          slashcommands.push(slashcommand.data.toJSON());
        },
      );
    },
  );

  readdirSync(join(process.cwd(), dir, 'events')).forEach((file: string) => {
    const event: EventT = require(join(process.cwd(), dir, 'events', file));

    if (event.once) {
      client.once(event.name, (...args: [any]) =>
        event.execute({ args, commands: slashcommands, client }),
      );
    } else {
      client.on(event.name, (...args: [any]) => {
        event.execute({
          args,
          client,
        });
      });
    }
  });
};
