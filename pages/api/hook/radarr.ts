import { NextApiRequest, NextApiResponse } from 'next';
import { schema } from 'ts-transformer-json-schema';
import initAuth from '../../../utils/initAuth';
import redis from '../../../utils/redis';
import type { Radarr } from '../../../types/Radarr';
import { verifyIdToken } from 'next-firebase-auth';
import { getUserByKey } from '../../../utils/apikeys';
import { apiWrapper } from '../../../utils/apiWrapper';
import * as pushTokens from '../../../utils/pushToken';
import { sendPushNotification } from '../../../services/fcm';

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
    try {
      const tokens = await pushTokens.getTokensByUser(userid);
      console.log('Radarr tokens', tokens);
      for (const token of tokens) {
        if (event.eventType !== 'Rename') {
          const res = await sendPushNotification({
            to: token.token,
            notification: {
              body: event.eventType,
              title: `${event.movie.title} (${event.remoteMovie.year})`,
              image: `https://www.pusharr.com/api/image/radarr/${event.remoteMovie.imdbId}/big`,
            },
          });
          console.log('Radarr push:', res.status);
        }
      }
    } catch (error: any) {
      console.log('Radarr push:', error.message);
    }
    return res.status(200).json({ added: true });
  }
};

export default apiWrapper(handler, {
  params: schema<Omit<Radarr.Event, '__source' | '__createdAt'>>(),
});
