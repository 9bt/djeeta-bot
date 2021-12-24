import { Request, Response, NextFunction }  from 'express';

export async function herokuMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (process.env.DYNO && !req.headers['x-heroku-dyno']) {
    res.status(400).send('Invalid request header \'x-heroku-dyno\'');
    return;
  }

  if (process.env.DYNO && req.headers['x-heroku-dyno'] !== process.env.DYNO) {
    res.status(401).send('Cannot match request header \'x-heroku-dyno\'');
    return;
  }

  await next();
}
