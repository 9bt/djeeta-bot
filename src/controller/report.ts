import { Message } from 'discord.js';

import { isReportChannel, sendToGeneralChannel } from '@/service/discord';

export function countGoldBrick(message: Message): void {
  if (!isReportChannel(message)) {
    return;
  }

  if (message.attachments.size === 0) {
    return;
  }

  // TODO: スプレッドシートに記録するように

  sendToGeneralChannel(`${message.author.username} さんが脱法しました`);
}
