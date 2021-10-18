import React from 'react';
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { mutate } from 'swr';
import { get, useApikeys, useEvents } from '../services/api';
import { LoggedInLayout } from '../components/LoggedInLayout';
import { LinkGenerator } from '../components/LinkGenerator';
import toast from 'react-hot-toast';
import { EventRow } from '../components/EventRow';
import { NoEvents } from '../components/NoEvents';

// TODO: Solve how to not use any here
const Dashboard: React.FC<any> = ({
  events: initialEvents,
  keys: initialKeys,
}) => {
  const AuthUser = useAuthUser();

  const { events } = useEvents(initialEvents);
  const { apikeys } = useApikeys(initialKeys);

  async function addSonarrTestData() {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL('/api/hook/sonarr');
    const res = await fetch(endpoint, {
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
          tvdbId: 377401,
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
    if (!res.ok) {
      const { error } = await res.json();
      if (error) {
        toast.error(error);
      }
    }
    mutate('/api/events');
  }

  async function addRadarrTestData() {
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
          imdbId: 'tt0078346',
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
    mutate('/api/events');
  }

  return (
    <LoggedInLayout title="Dashboard">
      {apikeys.length > 0 && <LinkGenerator apikeys={apikeys} />}

      {typeof window !== 'undefined' &&
        window.location.host.startsWith('localhost') && (
          <>
            <button type="button" onClick={() => addRadarrTestData()}>
              Add Radarr test data
            </button>

            <button type="button" onClick={() => addSonarrTestData()}>
              Add Sonarr test data
            </button>
          </>
        )}

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
                  {events.length === 0 ? (
                    <NoEvents />
                  ) : (
                    events.map((event) => (
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

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  // @ts-ignore
  const events = await get(AuthUser, 'events', req)('/api/events');
  // @ts-ignore
  const keys = await get(AuthUser, 'keys', req)('/api/apikeys');
  return {
    props: {
      events,
      keys,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
