import { Request, Response, NextFunction } from 'express';

export async function herokuMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.headers['x-heroku-deployment-id']) {
    res.status(400).send("Invalid request header 'x-heroku-deployment-id'");
    return;
  }

  if (req.headers['x-heroku-deployment-id'] !== process.env.DEPLOYMENT_ID) {
    res.status(401).send("Cannot match request header 'x-heroku-deployment-id'");
    return;
  }

  await next();
}
