// public/sw.js

// Service worker to handle background notifications

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  // Claim clients to ensure the SW controls the page immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;

  const { type, payload } = event.data;

  if (type === 'SCHEDULE_NOTIFICATION' && self.registration.showNotification) {
    const { match, title, options } = payload;
    
    // Schedule notification 10 minutes before the match
    const notificationTime = new Date(match.dateTime).getTime() - 10 * 60 * 1000;

    // Do not schedule if the time is in the past
    if (notificationTime < Date.now()) {
      console.log(`Notification for ${title} is in the past. Not scheduling.`);
      return;
    }

    // Use showTrigger for precise scheduling if available
    self.registration.showNotification(title, {
      ...options,
      showTrigger: new TimestampTrigger(notificationTime),
    }).catch(error => {
        console.error('Error scheduling notification:', error);
    });

  } else if (type === 'CANCEL_NOTIFICATION') {
    const { matchId } = payload;
    self.registration.getNotifications({ tag: matchId }).then(notifications => {
      notifications.forEach(notification => notification.close());
    });
  }
});
