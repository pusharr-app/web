import * as admin from 'firebase-admin';
import * as faker from 'faker';
import { Page } from '@playwright/test';

process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

admin.initializeApp({ projectId: 'pusharr' });

export interface User {
  name: string;
  email: string;
  password: string;
}

export async function generateUser(create: boolean): Promise<User> {
  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();
  const name = firstname + ' ' + lastname;
  const email = faker.internet.email(firstname, lastname);
  const password = faker.internet.password();
  if (create) {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
  }
  return {
    name,
    email,
    password,
  };
}

/**
 * Let's us login without going through the login page.
 */
export const login = (page: Page, user: User) =>
  page.evaluate(async (user) => {
    // @ts-ignore
    return window.login(user.email, user.password);
  }, user);
