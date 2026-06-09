self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'GameTracker Live';
  const options = {
    body: data.body || 'Live game update',
    icon: '/gametracker-brand.png',
    badge: '/gametracker-brand.png',
    tag: data.tag || 'gametracker',
    renotify: true,
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
