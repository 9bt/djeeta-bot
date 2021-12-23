import { Message, MessageEmbed, TextChannel } from 'discord.js';

import { getClient } from '@/discord';

export function isValidGuild(message: Message): boolean {
  return message.guildId === process.env.DISCORD_GUILD_ID;
}

export function isGeneralChannel(message: Message): boolean {
  return message.channelId === process.env.DISCORD_GENERAL_CHANNEL_ID;
}

export function isReportChannel(message: Message): boolean {
  return message.channelId === process.env.DISCORD_REPORT_CHANNEL_ID;
}

function getChannel(channelId: string): TextChannel | undefined {
  const channel = getClient().channels.cache.get(channelId);
  if (!channel) {
    return;
  }

  return channel as TextChannel;
}

export function sendMessage(messageText: string, channelId: string = ''): void {
  if (channelId === '') {
    return;
  }

  const channel = getChannel(channelId);
  if (!channel) {
    return;
  }

  channel.send(messageText);
}

export function sendMessageEmbed(messageEmbed: MessageEmbed, channelId: string = ''): void {
  if (channelId === '') {
    return;
  }

  const channel = getChannel(channelId);
  if (!channel) {
    return;
  }

  channel.send({ embeds: [messageEmbed] });
}
