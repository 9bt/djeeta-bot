import { Message, Interaction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';

import { getClient } from '@/discord';

export function isValidGuild(messageOrInteraction: Message | Interaction): boolean {
  return messageOrInteraction.guildId === process.env.DISCORD_GUILD_ID;
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

export function sendMessage(messageText: string, channelId = ''): void {
  if (channelId === '') {
    return;
  }

  const channel = getChannel(channelId);
  if (!channel) {
    return;
  }

  channel.send(messageText);
}

export function sendMessageEmbed(messageEmbed: MessageEmbed, channelId = ''): void {
  if (channelId === '') {
    return;
  }

  const channel = getChannel(channelId);
  if (!channel) {
    return;
  }

  channel.send({
    embeds: [messageEmbed],
    components: [
      new MessageActionRow().addComponents(
        new MessageButton({
          label: 'enabled',
          customId: 'enabled-button',
          style: 'PRIMARY',
        }),
        new MessageButton({
          label: 'disabled',
          customId: 'disabled-button',
          style: 'SECONDARY',
          disabled: true,
        })
      ),
    ],
  });
}
