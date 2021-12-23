import { listRecords } from '@/service/spreadsheet';

export interface Member {
  name: string;
  discordNickname: string;
}

export async function listMembers(): Promise<Member[]> {
  const records = await listRecords(process.env.GENERAL_SPREADSHEET_ID, 'Discord');

  return records.map((record) => {
    const member: Member = {
      name: record['名前'],
      discordNickname: record['Discordニックネーム'],
    };

    return member;
  });
}
