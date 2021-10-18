import React from 'react';
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth';
import FirebaseAuth from '../components/FirebaseAuth';

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <a href="/">
              <img className="h-12 w-auto" src="/logo.png" alt="Pusharr" />
            </a>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8">
            <FirebaseAuth />
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/pirate-ship.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

const Auth = () => (
  <div>
    <h3>Sign in</h3>
    <div>
      <p>
        This auth page is <b>not</b> static. It will server-side redirect to the
        app if the user is already authenticated.
      </p>
    </div>
    <div>
      <FirebaseAuth />
    </div>
  </div>
);

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Login);
