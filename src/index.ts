import express, { Request, Response, NextFunction } from 'express';

import { getClient } from '@/discord';
import { onMessage, onInteraction } from '@/handler';
import router from '@/router';
import { herokuMiddleware } from '@/middleware';
import { DiscordAPIError } from 'discord.js';

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

client.on('messageCreate', onMessage);

client.on('interactionCreate', onInteraction);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(herokuMiddleware);
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    res.status((err as any).statusCode || 500).send((err as any).message);
  }
});
app.use('/', router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
