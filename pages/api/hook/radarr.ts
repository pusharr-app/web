import { NextApiRequest, NextApiResponse } from 'next';
import { schema } from 'ts-transformer-json-schema';
import initAuth from '../../../utils/initAuth';
import redis from '../../../utils/redis';
import type { Radarr } from '../../../types/Radarr';
import { verifyIdToken } from 'next-firebase-auth';
import { getUserByKey } from '../../../utils/apikeys';
import { apiWrapper } from '../../../utils/apiWrapper';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    let userid: string | null;
    if (typeof req.query.apikey === 'string') {
      userid = await getUserByKey(req.query.apikey);
    } else {
      const token = req.headers.authorization;
      const user = await verifyIdToken(token ?? '');
      userid = user.id;
    }
    if (!userid) {
      throw new Error('wow you thought..');
    }
    const key = `events:${userid}`;
    const event: Radarr.Event = {
      ...req.body,
      __source: 'radarr',
      __createdAt: new Date(),
    };
    await redis.lpush(key, JSON.stringify(event));
    return res.status(200).json({ added: true });
  }
};

export default apiWrapper(handler, {
  params: schema<Omit<Radarr.Event, '__source' | '__createdAt'>>(),
});
