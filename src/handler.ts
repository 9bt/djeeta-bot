import { Client, Message, TextChannel } from 'discord.js';

import { getClient } from '@/discord';
import { isValidGuild } from '@/service/discord';
import { countGoldBrick } from '@/controller/report';

export function messageHandler(message: Message<boolean>) {
  if (!isValidGuild(message)) {
    return;
  }

  countGoldBrick(message);
}
