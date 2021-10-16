import { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../../utils/initAuth';
import redis from '../../../utils/redis';
import type { Sonarr } from '../../../types/Sonarr';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  const user = await verifyIdToken(token ?? '');
  const key = `entries:${user.id}`;

  if (req.method === 'POST' || req.method === 'PUT') {
    const event: Sonarr.Event = {
      ...req.body,
      __source: 'sonarr',
      __createdAt: new Date(),
    };
    // TODO: Verify event against interfaces
    await redis.lpush(key, JSON.stringify(event));
    return res.status(200).json({ added: true });
  }
};

export default handler;
