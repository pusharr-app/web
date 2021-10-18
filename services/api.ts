import { AuthUserContext, useAuthUser } from 'next-firebase-auth';
import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Event } from '../types/Event';
import { KeyInfo } from '../utils/apikeys';
import getAbsoluteURL from '../utils/getAbsoluteURL';

export const get =
  (AuthUser: AuthUserContext, pick?: string) => async (url: string) => {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL(url);
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

export function useEntries() {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<Event[]>(
    `/api/entries`,
    get(AuthUser, 'entries'),
  );

  return {
    entries: data ?? [],
    isLoading: !error && !data,
    error,
  };
}

export const createApiKey = async (name: string, AuthUser: AuthUserContext) => {
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

export function useApikeys() {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<KeyInfo[]>(
    `/api/apikeys`,
    get(AuthUser, 'keys'),
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
