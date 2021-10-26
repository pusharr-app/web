enum AndroidNotificationPriority {
  MIN = 'min',
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high',
  MAX = 'max',
}

interface PushNotification {
  to: string;
  notification: {
    body: string;
    title: string;
    image: string;
  };
}

export async function sendPushNotification(body: PushNotification) {
  const key = process.env.FCM_TOKEN;
  return fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${key}`,
    },
    body: JSON.stringify(body),
  });
}
