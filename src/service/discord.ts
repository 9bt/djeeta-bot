import { Message, TextChannel } from 'discord.js';

import { getClient } from '@/discord';

export function isValidGuild(message: Message): boolean {
  return message.guildId === process.env.DISCORD_GUILD_ID;
}

export function isGeneralChannel(message: Message): boolean {
  return message.channelId === process.env.DISCIRD_GENERAL_CHANNEL_ID;
}

export function isReportChannel(message: Message): boolean {
  return message.channelId === process.env.DISCIRD_REPORT_CHANNEL_ID;
}

export function sendToGeneralChannel(messageText: string) {
  if (process.env.DISCIRD_GENERAL_CHANNEL_ID) {
    const channel = getClient().channels.cache.get(process.env.DISCIRD_GENERAL_CHANNEL_ID);
    if (!channel) {
      return;
    }

    (channel as TextChannel).send(messageText);
  }
}
