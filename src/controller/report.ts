import { Message, MessageEmbed } from 'discord.js';

import { generateNewId } from '@/flaker';
import { isReportChannel, sendMessage, sendMessageEmbed } from '@/service/discord';
import {
  Report,
  createGoldBrickReport,
  findGoldBrickReportsInYear,
  findGoldBrickReportsInMonth,
  findGoldBrickReportsInMonthByDay,
  findGoldBrickReportsInYearAsName,
  findGoldBrickReportsInMonthAsName,
} from '@/repository/report';
import { listMembers } from '@/repository/member';

export async function reportGoldBrick(message: Message): Promise<void> {
  if (!isReportChannel(message)) {
    return;
  }

  if (message.attachments.size === 0) {
    return;
  }

  const id = generateNewId();

  const now = new Date();
  const offset = 9 * 60 * 60 * 1000;
  const dateSerial = (now.getTime() + offset) / 86400000 + 25569;

  const members = await listMembers();
  const member = members.find((member) => member.discordNickname === message.author.username);
  if (!member) {
    sendMessage(`無効な Discord ニックネームです。名前: ${message.author.username}`, message.channelId);
    return;
  }

  await createGoldBrickReport(id, member.name, dateSerial);

  sendMessage('カウントしました', message.channelId);
  sendMessage(`${member.name} さんが脱法しました`, process.env.DISCORD_GENERAL_CHANNEL_ID);
}

export async function aggregateGoldBrickReports(message: Message): Promise<void> {
  if (isReportChannel(message)) {
    return;
  }

  if (!message.content.startsWith('/ヒヒイロカネ')) {
    return;
  }

  const [, dateCondition, name] = message.content.split(' ');

  const now = new Date();

  let year = 0, month = 0;
  if (dateCondition === '今月') {
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }
  if (dateCondition === '先月') {
    year = now.getFullYear();
    month = now.getMonth() + 1 - 1;
  }
  if (dateCondition === '今年') {
    year = now.getFullYear();
  }

  let matches = dateCondition.match(/(?:(\d{4})年)?(?:(\d{1,2})月)?/);
  if (matches) {
    const [, yearStr, monthStr] = matches;
    year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();
    month = monthStr ? parseInt(monthStr, 10) : 0;
  }

  function sumCount(reports: Report[]): number {
    return reports.reduce((sum: number, report: Report) => sum + report.num, 0);
  }

  let title = '';
  let body = '';

  const isPresentMonth = month > 0 && month === now.getMonth() + 1;

  if (month === 0 && !name) {
    const reports = await findGoldBrickReportsInYear(year);
    const total = sumCount(reports);

    title = `${year}年: ${total}個`;
    body = reports.map((report) => `${report.name}: ${report.num}個`).join('\n');
  }

  if (month > 0 && !isPresentMonth && !name) {
    const reports = await findGoldBrickReportsInMonth(year, month);
    const total = sumCount(reports);

    title = `${year}年${month}月: ${total}個`;
    body = reports.map((report) => `${report.name}: ${report.num}個`).join('\n');
  }

  if (month > 0 && isPresentMonth && !name) {
    const reports = await findGoldBrickReportsInMonthByDay(year, month);
    const total = sumCount(reports);

    title = `${year}年${month}月: ${total}個`;

    const dayMap = new Map();
    reports.forEach((report) => {
      if (!dayMap.has(report.day)) {
        dayMap.set(report.day, []);
      }

      dayMap.get(report.day).push(report.num > 1 ? `×${report.num}` : '');
    });
    dayMap.forEach((texts, day) => {
      body += `${`${day}`.padStart(2, ' ')}日: ${texts.join(', ')}\n`;
    });
  }

  if (month === 0 && !!name) {
    const reports = await findGoldBrickReportsInYearAsName(year, name);
    const total = sumCount(reports);

    title = `${year}年 ${name}: ${total}個`;
    body = reports.map((report) => `${report.month}月: ${report.num}個`).join('\n');
  }

  if (month > 0 && !!name) {
    const reports = await findGoldBrickReportsInMonthAsName(year, month, name);
    const total = sumCount(reports);

    title = `${year}年${month}月 ${name}: ${total}個`;
    body = reports.map((report) => `${`${report.day}`.padStart(2, ' ')}日: ${report.num}個`).join('\n');
  }

  if (body === '') {
    sendMessage('条件に一致する脱法報告は 0 件です！', message.channelId);
    return;
  }

  const embed = new MessageEmbed();
  embed.setTitle('脱法ヒヒ数').addFields([{ name: title, value: `\`\`\`${body}\`\`\`` }]);

  sendMessageEmbed(embed, message.channelId);
}

export async function aggregateLawMasayoViolators(message: Message): Promise<void> {
  if (isReportChannel(message)) {
    return;
  }

  if (!message.content.startsWith('/まさよ法')) {
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const reports = await findGoldBrickReportsInMonth(year, month);
  const violators = reports.filter((report) => report.num >= 4).map((report) => `${report.name}さん(${report.num}個)`);

  const messageText = violators.length > 0 ? `今月のまさよ法違反は ${violators.join(', ')} です！` : '今月のまさよ法違反はいません！';
  sendMessage(messageText, message.channelId);
}
