self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "GAIA Farm Alert"
  const options = {
    body: data.body || "New sensor alert",
    icon: "/icon-dark-32x32.png",
    badge: "/icon-dark-32x32.png",
    data: { url: data.url || "/sensors" },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  const url = event.notification.data?.url || "/sensors"
  event.waitUntil(clients.openWindow(url))
})
