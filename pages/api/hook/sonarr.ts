import { NextApiRequest, NextApiResponse } from 'next';
import { schema } from 'ts-transformer-json-schema';
import initAuth from '../../../utils/initAuth';
import redis from '../../../utils/redis';
import type { Sonarr } from '../../../types/Sonarr';
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
    const event: Sonarr.Event = {
      ...req.body,
      __source: 'sonarr',
      __createdAt: new Date(),
    };
    await redis.lpush(key, JSON.stringify(event));
    try {
      const tokens = await pushTokens.getTokensByUser(userid);
      console.log('Sonarr tokens', tokens);
      for (const token of tokens) {
        if (event.eventType !== 'Rename') {
          const ep = event.episodes[0];
          const seasonEpisode = `S${ep.seasonNumber
            .toString()
            .padStart(2, '0')}E${ep.episodeNumber
            .toString()
            .padStart(2, '0')} ${ep.quality ?? ''}`;
          const res = await sendPushNotification({
            to: token.token,
            notification: {
              body: `${event.eventType} ${seasonEpisode}`,
              title: event.series.title,
              image: `https://www.pusharr.com/api/image/sonarr/${event.series.tvdbId}/big`,
            },
          });
          console.log('Sonarr push:', res.status);
        }
      }
    } catch (error: any) {
      console.log('Sonarr push:', error.message);
    }
    return res.status(200).json({ added: true });
  }
};

export default apiWrapper(handler, {
  params: schema<Omit<Sonarr.Event, '__source' | '__createdAt'>>(),
});
