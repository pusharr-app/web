import React from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import TimeAgo from 'react-timeago';
import FullPageLoader from '../components/FullPageLoader';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { mutate } from 'swr';
import { useEntries } from '../services/api';
import { LoggedInLayout } from '../components/LoggedInLayout';
import { Sonarr } from '../types/Sonarr';
import { ExclamationIcon } from '@heroicons/react/outline';

const Dashboard = () => {
  const AuthUser = useAuthUser();

  const { entries } = useEntries();

  const emoji: Record<Sonarr.EventType, string> = {
    Grab: '🤏',
    Download: '💾',
    Rename: '✔️',
    Test: '🧪',
  };

  async function addTestData() {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL('/api/hook/sonarr');
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'Test',
        series: {
          id: 1,
          title: 'Test Title',
          path: 'C:\\testpath',
          tvdbId: 1234,
        },
        episodes: [
          {
            id: 123,
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Test title',
            qualityVersion: 0,
          },
        ],
      }),
    });
    mutate('/api/entries');
  }

  return (
    <LoggedInLayout title="Dashboard">
      <button onClick={() => addTestData()}>Add sonarr test data</button>
      <ul role="list" className="divide-y divide-gray-200">
        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <li key={entry.__createdAt.toString()} className="py-4">
              <div className="flex space-x-3">
                <img
                  className="h-6 w-6 rounded-full"
                  src="https://artworks.thetvdb.com/banners/posters/5d2781b5c9f50.jpg"
                  alt=""
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">
                        {emoji[entry.eventType]}{' '}
                        <strong>{entry.series.title}</strong>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {entry.episodes &&
                          entry.episodes.map((episode) => (
                            <p>{episode.title}</p>
                          ))}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      {entry.__source}
                      <br />
                      <TimeAgo date={entry.__createdAt} />
                    </p>
                  </div>
                </div>
              </div>
            </li>
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
