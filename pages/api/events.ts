import { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../utils/initAuth';
import redis from '../../utils/redis';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  const user = await verifyIdToken(token ?? '');
  const key = `events:${user.id}`;

  const events = await redis.lrange(key, 0, 49);
  return res.status(200).json({ events: events.map((e) => JSON.parse(e)) });
};

export default handler;
