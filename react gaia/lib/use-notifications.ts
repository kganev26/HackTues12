"use client"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

/**
 * Subscribe the current browser to push notifications.
 * Returns { ok, error } so the caller can show feedback.
 */
export async function subscribePush(apiUrl: string): Promise<{ ok: boolean; error?: string }> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, error: "Browser does not support push notifications" }
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return { ok: false, error: "Not logged in" }
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      return { ok: false, error: "Notification permission denied" }
    }

    const reg = await navigator.serviceWorker.register("/sw.js")
    await navigator.serviceWorker.ready

    const keyRes = await fetch(`${apiUrl}/vapid-public-key`)
    if (!keyRes.ok) {
      return { ok: false, error: `Failed to fetch VAPID key (${keyRes.status})` }
    }
    const { publicKey } = await keyRes.json()

    let subscription = await reg.pushManager.getSubscription()
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    const res = await fetch(`${apiUrl}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    })

    if (!res.ok) {
      return { ok: false, error: `Subscribe failed (${res.status})` }
    }

    return { ok: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg }
  }
}

/**
 * Unsubscribe the current browser from push notifications.
 */
export async function unsubscribePush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false

  const reg = await navigator.serviceWorker.getRegistration("/sw.js")
  if (!reg) return true

  const subscription = await reg.pushManager.getSubscription()
  if (subscription) {
    await subscription.unsubscribe()
  }

  return true
}

/**
 * Check whether the user currently has an active push subscription.
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false

  const reg = await navigator.serviceWorker.getRegistration("/sw.js")
  if (!reg) return false

  const subscription = await reg.pushManager.getSubscription()
  return subscription !== null
}
