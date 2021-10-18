import React from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import FullPageLoader from '../components/FullPageLoader';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { mutate } from 'swr';
import { useApikeys, useEntries } from '../services/api';
import { LoggedInLayout } from '../components/LoggedInLayout';
import { LinkGenerator } from '../components/LinkGenerator';
import toast from 'react-hot-toast';
import { EventRow } from '../components/EventRow';
import { NoEvents } from '../components/NoEvents';

const Dashboard = () => {
  const AuthUser = useAuthUser();

  const { entries } = useEntries();
  const { apikeys } = useApikeys();

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
      {apikeys.length > 0 && <LinkGenerator apikeys={apikeys} />}

      <div className="flex flex-col mt-5">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Media
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Source
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      When
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.length === 0 ? (
                    <NoEvents />
                  ) : (
                    entries.map((event) => (
                      <EventRow event={event} key={event.__createdAt} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(Dashboard);
