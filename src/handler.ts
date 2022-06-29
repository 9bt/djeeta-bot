import { Message, Interaction } from 'discord.js';

import { isValidGuild, sendMessage } from '@/service/discord';
import {
  reportGoldBrick,
  reportGoldBrickByName,
  aggregateGoldBrickReports,
  removeRecentGoldBrickReport,
  aggregateLawMasayoViolators,
} from '@/controller/report';

export async function onMessage(message: Message<boolean>) {
  try {
    if (!isValidGuild(message)) {
      return;
    }

    await reportGoldBrick(message);
    await reportGoldBrickByName(message);
    await aggregateGoldBrickReports(message);
    await aggregateLawMasayoViolators(message);
    await removeRecentGoldBrickReport(message);
  } catch (e) {
    sendMessage('処理に失敗しました', message.channelId);
    console.error(e);
  }
}

export async function onInteraction(interaction: Interaction) {
  try {
    if (!isValidGuild(interaction)) {
      return;
    }

    if (interaction.isButton()) {
      console.log(interaction);
      await interaction.reply({
        content: 'Pong!',
      });
      return;
    }
  } catch (e) {
    console.error(e);
  }
}
