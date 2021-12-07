import { Client, Intents } from 'discord.js';

let client: Client | null = null;

function initializeClient(): Client {
  const cl = new Client({ intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES });
  cl.login(process.env.DISCORD_BOT_TOKEN);

  return cl;
}

export function getClient(): Client {
  if (!client) {
    client = initializeClient();
  }

  return client;
}
