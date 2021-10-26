import { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../utils/initAuth';
import { verifyIdToken } from 'next-firebase-auth';
import * as pushToken from '../../utils/pushToken';
import { schema } from 'ts-transformer-json-schema';
import Validator, { ValidationError } from 'fastest-validator';

const v = new Validator();

initAuth();

type PostBody = Pick<pushToken.PushToken, 'token' | 'name'>;

const postParams = schema<PostBody>();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  const user = await verifyIdToken(token ?? '');
  if (req.method === 'GET') {
    const tokens = await pushToken.getTokensByUser(user.id!);
    return res.status(200).json({ tokens });
  }
  if (req.method === 'POST') {
    const body = req.body as PostBody;
    const valid = v.validate(req.body, postParams);
    if (!valid) {
      throw new Error('oops');
    }
    const record = await pushToken.addToken(user.id!, body.token, body.name);
    return res.status(200).json(record);
  }
  if (req.method === 'DELETE') {
    await pushToken.deleteToken(user.id!, req.body.id);
    return res.status(200).json({ ok: true });
  }
  return res.status(404);
};

export default handler;
