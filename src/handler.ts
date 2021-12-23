import { Client, Message, TextChannel } from 'discord.js';

import { getClient } from '@/discord';
import { isValidGuild } from '@/service/discord';
import { reportGoldBrick, aggregateGoldBrickReports, aggregateLawMasayoViolators } from '@/controller/report';

export async function messageHandler(message: Message<boolean>) {
  if (!isValidGuild(message)) {
    return;
  }

  await reportGoldBrick(message);
  await aggregateGoldBrickReports(message);
  await aggregateLawMasayoViolators(message);
}
