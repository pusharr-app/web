import uniqid from 'uniqid';
import redis from './redis';

export interface PushToken {
  id: string;
  token: string;
  name: string;
  createdAt: string;
  lastUsed: false | string;
}

const key = (user: string) => `pushtokens:${user}`;

export async function getTokensByUser(user: string): Promise<PushToken[]> {
  const tokens = await redis.hvals(key(user));
  return tokens.map((token) => JSON.parse(token));
}

export async function addToken(user: string, token: string, name: string) {
  const id = uniqid();
  const pushToken: PushToken = {
    id,
    token,
    name,
    createdAt: new Date().toISOString(),
    lastUsed: false,
  };
  await redis.hset(key(user), id, JSON.stringify(pushToken));
  return pushToken;
}

export async function deleteToken(user: string, id: string) {
  await redis.hdel(key(user), id);
}
