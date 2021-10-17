import React from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import FullPageLoader from '../components/FullPageLoader';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { mutate } from 'swr';
import { useEntries } from '../services/api';
import { LoggedInLayout } from '../components/LoggedInLayout';
import { ExclamationIcon } from '@heroicons/react/outline';
import { LinkGenerator } from '../components/LinkGenerator';
import toast from 'react-hot-toast';
import { EventRow } from '../components/EventRow';

const Dashboard = () => {
  const AuthUser = useAuthUser();

  const { entries } = useEntries();

  async function addTestData() {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL('/api/hook/radarr');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'Test',
        movie: {
          id: 1,
          title: 'Test Title',
          releaseDate: '1970-01-01',
        },
        remoteMovie: {
          tmdbId: 1234,
          imdbId: '5678',
          title: 'Test title',
          year: 1970,
        },
        release: {
          quality: 'Test Quality',
          qualityVersion: 1,
          releaseGroup: 'Test Group',
          releaseTitle: 'Test Title',
          indexer: 'Test Indexer',
          size: 9999999,
        },
      }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      if (error) {
        toast.error(error);
      }
    }
    mutate('/api/entries');
  }

  return (
    <LoggedInLayout title="Dashboard">
      <LinkGenerator />
      <button onClick={() => addTestData()}>Add radarr test data</button>
      <ul role="list" className="divide-y divide-gray-200">
        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <EventRow key={entry.__createdAt.toString()} event={entry} />
          ))
        ) : (
          <div className="flex content-center mt-5">
            <button
              type="button"
              onClick={() => addTestData()}
              className="block w-4/5 border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ExclamationIcon className="h-6 w-6" aria-hidden="true" />
              <button
                type="button"
                className="mt-2 block text-sm font-medium text-gray-900"
              >
                Add a test row
              </button>
            </button>
          </div>
        )}
      </ul>
    </LoggedInLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(Dashboard);
