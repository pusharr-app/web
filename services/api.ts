import { AuthUserContext, useAuthUser } from 'next-firebase-auth';
import useSWR from 'swr';
import { Sonarr } from '../types/Sonarr';
import getAbsoluteURL from '../utils/getAbsoluteURL';

export const get =
  (AuthUser: AuthUserContext, pick?: string) => async (url: string) => {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL(url);
    const json = await fetch(endpoint, {
      headers: {
        Authorization: token!,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('json', json);
        return json;
      });
    if (pick) {
      return json[pick];
    }
    return json;
  };

export function useEntries() {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<Sonarr.Event[]>(
    `/api/entries`,
    get(AuthUser, 'entries'),
  );

  return {
    entries: data ?? [],
    isLoading: !error && !data,
    error,
  };
}
