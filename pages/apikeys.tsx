import React from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Header from '../components/Header';
import FullPageLoader from '../components/FullPageLoader';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import useSWR, { mutate } from 'swr';
import { get, useEntries } from '../services/api';
import { Sonarr } from '../types/Sonarr';
import { deleteKey } from '../utils/apikeys';
import { ApikeyItem } from '../components/ApikeyItem';

const Apikeys = () => {
  const AuthUser = useAuthUser();
  const { data, error } = useSWR<string[]>(
    `/api/apikeys`,
    get(AuthUser, 'keys'),
  );

  async function createKey() {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL('/api/apikeys');
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
    });
    mutate('/api/apikeys');
  }

  async function deleteKey(key: string) {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL('/api/apikeys');
    await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });
    mutate('/api/apikeys');
  }

  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div>
        <div>
          <h3>Apikeys</h3>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => createKey()}
          >
            Create apikey
          </button>
          {data && data.map((key) => <ApikeyItem key={key} apikey={key} />)}
        </div>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(Apikeys);
