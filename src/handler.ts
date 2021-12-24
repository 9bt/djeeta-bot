import { Client, Message, TextChannel } from 'discord.js';

import { getClient } from '@/discord';
import { isValidGuild, sendMessage } from '@/service/discord';
import { reportGoldBrick, aggregateGoldBrickReports, removeRecentGoldBrickReport, aggregateLawMasayoViolators } from '@/controller/report';

export async function messageHandler(message: Message<boolean>) {
  try {
    if (!isValidGuild(message)) {
      return;
    }

    await reportGoldBrick(message);
    await aggregateGoldBrickReports(message);
    await aggregateLawMasayoViolators(message);
    await removeRecentGoldBrickReport(message);
  } catch (e) {
    sendMessage('処理に失敗しました', message.channelId);
    console.error(e);
  }
}
