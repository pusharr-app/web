import redis from './redis';

export async function getKeysByUser(user: string) {
  return redis.hkeys('apikeys:' + user);
}

export async function getUserByKey(key: string) {
  return redis.get('apikey:' + key);
}

export async function addKey(user: string, key: string) {
  await redis.hset('apikeys:' + user, key, 'true');
  await redis.set('apikey:' + key, user);
}

export async function deleteKey(user: string, key: string) {
  await redis.hdel('apikeys:' + user, key);
  await redis.del('apikey:' + key);
}
