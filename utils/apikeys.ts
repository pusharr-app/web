import redis from './redis';

export interface KeyInfo {
  key: string;
  name: string;
  createdAt: string;
  lastUsed: false | string;
}

export async function getKeysByUser(user: string): Promise<KeyInfo[]> {
  const keys = await redis.hvals('apikeys:' + user);
  return keys.map((key) => JSON.parse(key));
}

export async function getUserByKey(key: string) {
  return redis.get('apikey:' + key);
}

export async function addKey(user: string, key: string, name: string) {
  const keyInfo: KeyInfo = {
    key,
    name,
    createdAt: new Date().toISOString(),
    lastUsed: false,
  };
  await redis.hset('apikeys:' + user, key, JSON.stringify(keyInfo));
  await redis.set('apikey:' + key, user);
}

export async function deleteKey(user: string, key: string) {
  await redis.hdel('apikeys:' + user, key);
  await redis.del('apikey:' + key);
}
