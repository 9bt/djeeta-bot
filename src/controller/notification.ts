import { MessageEmbed } from 'discord.js';
import { Request, Response } from 'express';

import { sendMessageEmbed } from '@/service/discord';
import { Report, findGoldBrickReportsInMonth } from '@/repository/report';

export async function sendMessageToDiscord(req: Request, res: Response): Promise<void> {
  if (req.body.type === 'in-a-month') {
    const date = new Date();
    const isBeginningOfMonth = date.getDate() === 1;
    if (!isBeginningOfMonth) {
      res.status(400).send(`Today is not beginning of month. day: ${date.getDate()}`);
      return;
    }

    date.setMonth(date.getMonth() - 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const reports = await findGoldBrickReportsInMonth(year, month);
    const total = reports.reduce((sum: number, report: Report) => sum + report.num, 0);

    const title = `${year}年${month}月: ${total}個`;
    const body = reports.map((report) => `${report.name}: ${report.num}個`).join('\n');
    if (body === '') {
      res.status(404).send(`No reports are found.`);
      return;
    }

    const embed = new MessageEmbed();
    embed.setTitle('脱法ヒヒ数').addFields([{ name: title, value: `\`\`\`${body}\`\`\`` }]);

    sendMessageEmbed(embed, process.env.DISCORD_GENERAL_CHANNEL_ID);
    res.status(204).end();
  }
}
