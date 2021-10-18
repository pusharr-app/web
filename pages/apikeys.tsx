import React, { useState } from 'react';
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { get, createApiKey, useApikeys } from '../services/api';
import { ApikeyItem } from '../components/ApikeyItem';
import { LoggedInLayout } from '../components/LoggedInLayout';

// TODO: Solve how to not use any here
const Apikeys: React.FC<any> = ({ keys: initialKeys }) => {
  const AuthUser = useAuthUser();
  const { apikeys, error } = useApikeys(initialKeys);
  const [newKeyName, setNewKeyName] = useState('');

  async function createKey() {
    await createApiKey(newKeyName, AuthUser);
    setNewKeyName('');
  }

  return (
    <LoggedInLayout title="Apikeys">
      <div className="flex space-x-5">
        <input
          type="text"
          name="email"
          id="email"
          className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="API key name"
          onChange={(e) => setNewKeyName(e.target.value)}
          value={newKeyName}
        />
        <button
          type="button"
          disabled={newKeyName.length === 0}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => createKey()}
        >
          Create apikey
        </button>
      </div>
      <div className="flex flex-col mt-4">
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Key
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apikeys.map((key, idx) => (
                    <ApikeyItem
                      key={key.key}
                      apikey={key}
                      idx={idx}
                      apikeysNo={apikeys.length}
                    />
                  ))}
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
  const keys = await get(AuthUser, 'keys', req)('/api/apikeys');
  return {
    props: {
      keys,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Apikeys);
