import React, { useCallback, useEffect, useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Header from '../components/Header';
import DemoPageLinks from '../components/DemoPageLinks';
import FullPageLoader from '../components/FullPageLoader';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { Sonarr } from '../types/Sonarr';

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
};

const Demo = () => {
  const AuthUser = useAuthUser(); // the user is guaranteed to be authenticated

  const [entries, setEntries] = useState<Sonarr.Event[]>();
  const fetchData = useCallback(async () => {
    const token = await AuthUser.getIdToken();
    const endpoint = getAbsoluteURL('/api/entries');
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: token!,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(
        `Data fetching failed with status ${response.status}: ${JSON.stringify(
          data,
        )}`,
      );
      return null;
    }
    return data;
  }, [AuthUser]);

  useEffect(() => {
    let isCancelled = false;
    const fetchFavoriteColor = async () => {
      const data = await fetchData();
      if (!isCancelled) {
        setEntries(data.entries);
      }
    };
    fetchFavoriteColor();
    return () => {
      // A quick but not ideal way to avoid state updates after unmount.
      // In your app, prefer aborting fetches:
      // https://developers.google.com/web/updates/2017/09/abortable-fetch
      isCancelled = true;
    };
  }, [fetchData]);

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
  }

  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h3>Dashboard</h3>
          <button onClick={() => addTestData()}>Add sonarr test data</button>
          <ul role="list" className="divide-y divide-gray-200">
            {entries &&
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
                        <h3 className="text-sm font-medium">
                          {entry.series.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {entry.eventType}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Deployed {entry.__source}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          <pre>{JSON.stringify(entries, null, 4)}</pre>
        </div>
        <DemoPageLinks />
      </div>
    </div>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(Demo);
