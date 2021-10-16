import { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../../utils/initAuth';
import redis from '../../../utils/redis';
import type { Sonarr } from '../../../types/Sonarr';
import { verifyIdToken } from 'next-firebase-auth';
import { getUserByKey } from '../../../utils/apikeys';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    let userid: string | null;
    if (typeof req.query.apikey === 'string') {
      // check if apikey matches user
      userid = await getUserByKey(req.query.apikey);
    } else {
      const token = req.headers.authorization;
      const user = await verifyIdToken(token ?? '');
      userid = user.id;
    }
    if (!userid) {
      throw new Error('wow you thougth..');
    }
    const key = `entries:${userid}`;
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
