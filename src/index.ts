import { getClient } from '@/discord';
import { messageHandler } from '@/handler';

const envFile = process.env.ENV_FILE || '.env';
require('dotenv').config({
  path: `${__dirname}/../${envFile}`,
});

const client = getClient();

client.on('ready', () => {
  if (!client.user) {
    return;
  }

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', messageHandler);
