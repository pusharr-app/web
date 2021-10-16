import { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../utils/initAuth';
import { verifyIdToken } from 'next-firebase-auth';
import * as apikeys from '../../utils/apikeys';
import uniqid from 'uniqid';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  const user = await verifyIdToken(token ?? '');
  if (req.method === 'GET') {
    const keys = await apikeys.getKeysByUser(user.id!);
    return res.status(200).json({ keys });
  }
  if (req.method === 'POST') {
    const key = uniqid();
    await apikeys.addKey(user.id!, key);
    return res.status(200).json({ key });
  }
  if (req.method === 'DELETE') {
    await apikeys.deleteKey(user.id!, req.body.key);
    return res.status(200).json({ ok: true });
  }
  return res.status(404);
};

export default handler;
