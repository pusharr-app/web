import React, { useState } from 'react';
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { get, usePushTokens, createPushToken } from '../services/api';
import { LoggedInLayout } from '../components/LoggedInLayout';
import { PushToken } from '../components/PushToken';

// TODO: Solve how to not use any here
const Pushtokens: React.FC<any> = ({ tokens: initialTokens }) => {
  const AuthUser = useAuthUser();
  const { tokens, error } = usePushTokens(initialTokens);
  const [newToken, setNewToken] = useState('');

  async function createKey() {
    await createPushToken('test', newToken, AuthUser);
    setNewToken('');
  }

  return (
    <LoggedInLayout title="Push tokens">
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
                      Created
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, idx) => (
                    <PushToken key={token.id} token={token} idx={idx} />
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
  const tokens = await get(AuthUser, 'tokens', req)('/api/push-tokens');
  return {
    props: {
      tokens,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Pushtokens);
