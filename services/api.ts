import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { AuthUser, useAuthUser } from 'next-firebase-auth';
import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Event } from '../types/Event';
import { KeyInfo } from '../utils/apikeys';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { PushToken } from '../utils/pushToken';

export const get =
  (AuthUser: AuthUser, pick?: string, req?: NextApiRequest) =>
  async (url: string) => {
    const token = await AuthUser.getIdToken();
    const endpoint = url.startsWith('https://')
      ? url
      : getAbsoluteURL(url, req);
    const json = await fetch(endpoint, {
      headers: {
        Authorization: token!,
      },
    }).then((res) => res.json());
    if (pick) {
      return json[pick];
    }
    return json;
  };

export function useEvents(fallbackData?: Event[]) {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<Event[]>(
    `/api/events`,
    get(AuthUser, 'events'),
    { fallbackData },
  );

  return {
    events: data ?? [],
    isLoading: !error && !data,
    error,
  };
}

export const createApiKey = async (name: string, AuthUser: AuthUser) => {
  const token = await AuthUser.getIdToken();
  const endpoint = getAbsoluteURL('/api/apikeys');
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: token!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  mutate('/api/apikeys');
};

export function useApikeys(fallbackData?: KeyInfo[]) {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<KeyInfo[]>(
    `/api/apikeys`,
    get(AuthUser, 'keys'),
    { fallbackData },
  );
  useEffect(() => {
    if (data && data.length === 0) {
      createApiKey('Default', AuthUser);
    }
  }, [data]);
  return {
    apikeys: data ?? [],
    isLoading: !error && !data,
    error,
  };
}

export const createPushToken = async (
  name: string,
  token: string,
  AuthUser: AuthUser,
) => {
  const authToken = await AuthUser.getIdToken();
  const endpoint = getAbsoluteURL('/api/push-tokens');
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: authToken!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, token }),
  });
  mutate('/api/push-tokens');
};

export function usePushTokens(fallbackData?: PushToken[]) {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<PushToken[]>(
    `/api/push-tokens`,
    get(AuthUser, 'tokens'),
    { fallbackData },
  );
  return {
    tokens: data ?? [],
    isLoading: !error && !data,
    error,
  };
}
