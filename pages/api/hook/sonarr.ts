import { NextApiRequest, NextApiResponse } from 'next';
import { schema } from 'ts-transformer-json-schema';
import Validator, { ValidationError } from 'fastest-validator';
import initAuth from '../../../utils/initAuth';
import redis from '../../../utils/redis';
import type { Sonarr } from '../../../types/Sonarr';
import { verifyIdToken } from 'next-firebase-auth';
import { getUserByKey } from '../../../utils/apikeys';

initAuth();

const v = new Validator();

interface ApiWrapperOpts {
  params?: object;
}

const apiWrapper =
  (
    fn: (req: NextApiRequest, res: NextApiResponse) => unknown,
    options: ApiWrapperOpts = {},
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (options.params) {
        const valid = v.validate(req.body, options.params);
        if (valid !== true) {
          const errors = valid as ValidationError[];
          console.error('Validation error:', errors);
          throw new Error(errors[0].message);
        }
      }
      return fn(req, res);
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

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
    const key = `entries:${userid}`;
    const event: Sonarr.Event = {
      ...req.body,
      __source: 'sonarr',
      __createdAt: new Date(),
    };
    await redis.lpush(key, JSON.stringify(event));
    return res.status(200).json({ added: true });
  }
};

export default apiWrapper(handler, {
  params: schema<Omit<Sonarr.Event, '__source' | '__createdAt'>>(),
});
