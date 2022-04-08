import 'dotenv/config';

import { IClient } from '@/interfaces';
import { Client, Collection } from 'discord.js';
// import { handler } from '@/handlers';

const client: IClient = new Client({
  intents: 32767,
});

client.commands = new Collection();
client.slashcommands = new Collection();

// handler(client);

client.login(process.env.TOKEN);

export { client };
