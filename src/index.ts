import express from 'express';

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

const app = express();
app.get('/', (req, res) => {
  res.send('Welcome to djeeta-app!');
});

app.get('/', (req, res) => {
  res.send('Welcome to djeeta-app!');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
