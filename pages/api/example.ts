import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth from '../../utils/initAuth';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.headers && req.headers.authorization)) {
    return res
      .status(400)
      .json({ error: 'Missing Authorization header value' });
  }
  const token = req.headers.authorization;

  let favoriteColor;

  // This "unauthenticated" token is just an demo of the
  // "SSR with no token" example.
  if (token === 'unauthenticated') {
    favoriteColor = 'unknown, because you called the API without an ID token';
  } else {
    try {
      const user = await verifyIdToken(token);
      console.log('user', user);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return res.status(403).json({ error: 'Not authorized' });
    }

    const colors = [
      'sea foam green',
      'light purple',
      'teal',
      'taupe',
      'dark grey',
    ];
    favoriteColor = colors[Math.floor(Math.random() * colors.length)];
  }

  return res.status(200).json({ favoriteColor });
};

export default handler;
