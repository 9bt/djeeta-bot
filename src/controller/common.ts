import { Request, Response } from 'express';

export function preventFromSleepingInstance(req: Request, res: Response): void {
  res.status(204).end();
}
