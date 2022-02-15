import 'dotenv/config';

import { IClient } from './interfaces/Client';
import { Client, Collection } from 'discord.js';
import { handle } from './handlers';

const client: IClient = new Client({
  intents: 32767,
});

client.commands = new Collection();
client.slashcommands = new Collection();

handle(client);

client.login(process.env.TOKEN);

export { client };
