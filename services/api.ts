import { NextApiRequest } from 'next';
import { AuthUser, useAuthUser } from 'next-firebase-auth';
import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Event } from '../types/Event';
import { KeyInfo } from '../utils/apikeys';
import getAbsoluteURL from '../utils/getAbsoluteURL';

export const get =
  (AuthUser: AuthUser, pick?: string, req?: NextApiRequest) =>
  async (url: string) => {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL(url, req);
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

export function useEntries(fallbackData?: Event[]) {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<Event[]>(
    `/api/entries`,
    get(AuthUser, 'entries'),
    { fallbackData },
  );

  return {
    entries: data ?? [],
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
