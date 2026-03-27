"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogOut, User, LogIn, Bell, BellOff } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { subscribePush, unsubscribePush, isPushSubscribed } from "@/lib/use-notifications"
import AuthGuard from "@/components/auth-guard"

const API_URL = "http://10.210.46.104:5500"

interface CurrentUser {
  id: number
  username: string
  firstname: string
  lastname: string
  mac_address: string | null
  agriculture: string | null
  country: string | null
  province: string | null
  gender: string | null
  birthyear: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [macInput, setMacInput] = useState("")
  const [macEditing, setMacEditing] = useState(false)
  const [macError, setMacError] = useState("")
  const [macSaving, setMacSaving] = useState(false)

  const [genderEditing, setGenderEditing] = useState(false)
  const [genderValue, setGenderValue] = useState("")
  const [genderSaving, setGenderSaving] = useState(false)

  const [birthyearEditing, setBirthyearEditing] = useState(false)
  const [birthyearValue, setBirthyearValue] = useState("")
  const [birthyearSaving, setBirthyearSaving] = useState(false)

  const [profileError, setProfileError] = useState("")

  const [notifEnabled, setNotifEnabled] = useState(false)
  const [notifDenied, setNotifDenied] = useState(false)
  const [notifLoading, setNotifLoading] = useState(false)

  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data)
        localStorage.setItem("currentUser", JSON.stringify(data))
      })
      .catch(() => {
        const stored = localStorage.getItem("currentUser")
        if (stored) setUser(JSON.parse(stored))
      })

    // Check current push subscription status
    if ("Notification" in window && Notification.permission === "denied") {
      setNotifDenied(true)
    } else {
      isPushSubscribed().then(setNotifEnabled)
    }
  }, [])

  const handleToggleNotifications = async () => {
    setNotifLoading(true)
    setProfileError("")
    try {
      if (notifEnabled) {
        const ok = await unsubscribePush()
        if (ok) setNotifEnabled(false)
      } else {
        const result = await subscribePush(API_URL)
        if (result.ok) {
          setNotifEnabled(true)
          setNotifDenied(false)
        } else {
          if ("Notification" in window && Notification.permission === "denied") {
            setNotifDenied(true)
          }
          setProfileError(result.error || "Failed to enable notifications")
        }
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Notification toggle failed")
    } finally {
      setNotifLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const handleSaveProfile = async (field: string, value: string) => {
    setProfileError("")
    if (field === "gender") setGenderSaving(true)
    else setBirthyearSaving(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: value }),
      })
      const data = await res.json()
      if (!res.ok) { setProfileError(data.message || "Failed to save"); return }
      const updated = { ...user!, [field]: value }
      setUser(updated)
      localStorage.setItem("currentUser", JSON.stringify(updated))
      if (field === "gender") setGenderEditing(false)
      else setBirthyearEditing(false)
    } catch {
      setProfileError("Cannot connect to server")
    } finally {
      if (field === "gender") setGenderSaving(false)
      else setBirthyearSaving(false)
    }
  }

  const handleSaveMac = async () => {
    setMacError("")
    setMacSaving(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/user/mac`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mac_address: macInput }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMacError(data.message || "Failed to save")
        return
      }
      const updated = { ...user!, mac_address: data.mac_address }
      setUser(updated)
      localStorage.setItem("currentUser", JSON.stringify(updated))
      setMacInput("")
      setMacEditing(false)
    } catch {
      setMacError("Cannot connect to server")
    } finally {
      setMacSaving(false)
    }
  }

  return (
    <AuthGuard>
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-5 flex items-center gap-4">
        <Link href="/" className="text-3xl font-black text-amber-500 tracking-widest hover:opacity-80 transition-opacity">GAIA</Link>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          {t("profile_label")}
        </span>
      </div>

      {/* Content */}
      <div className="px-8 py-10 flex justify-center">
        {user ? (
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t("profile_account_details")}</span>
              <button
                onClick={handleSignOut}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("profile_sign_out")}
              </button>
            </div>

            {/* Fields */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_username")}</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">@{user.username}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_first_name")}</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">{user.firstname}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_last_name")}</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">{user.lastname}</span>
              </div>

              {/* MAC Address row */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_mac_address")}</span>
                  {!macEditing && (
                    <div className="flex items-center gap-3">
                      {user.mac_address ? (
                        <span className="text-gray-900 dark:text-gray-100 font-semibold font-mono">{user.mac_address}</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-sm italic">{t("not_set")}</span>
                      )}
                      <button
                        onClick={() => { setMacInput(user.mac_address ?? ""); setMacEditing(true); setMacError("") }}
                        className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                      >
                        {user.mac_address ? t("change") : t("set")}
                      </button>
                    </div>
                  )}
                </div>

                {macEditing && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={macInput}
                      onChange={(e) => setMacInput(e.target.value)}
                      placeholder="AA:BB:CC:DD:EE:FF"
                      autoFocus
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      onClick={handleSaveMac}
                      disabled={macSaving || !macInput.trim()}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      {macSaving ? t("saving") : t("save")}
                    </button>
                    <button
                      onClick={() => { setMacEditing(false); setMacError("") }}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg text-sm transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                )}
                {macError && <p className="mt-2 text-red-500 text-xs">{macError}</p>}
              </div>

              {/* Agriculture */}
              {user.agriculture && (
                <div className="px-6 py-4">
                  <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium block mb-2">{t("profile_agriculture")}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user.agriculture.split(",").map((a) => (
                      <span key={a} className="px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full text-xs font-semibold capitalize">
                        {a.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Country / Province */}
              {(user.country || user.province) && (
                <div className="px-6 py-4 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_region")}</span>
                  <span className="text-gray-900 dark:text-gray-100 font-semibold text-right">
                    {[user.province, user.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}

              {/* Gender */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_gender")}</span>
                  {!genderEditing && (
                    <div className="flex items-center gap-3">
                      {user.gender ? (
                        <span className="text-gray-900 dark:text-gray-100 font-semibold capitalize">{user.gender.replace(/_/g, " ")}</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-sm italic">{t("not_set")}</span>
                      )}
                      <button
                        onClick={() => { setGenderValue(user.gender ?? ""); setGenderEditing(true) }}
                        className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                      >
                        {user.gender ? t("change") : t("set")}
                      </button>
                    </div>
                  )}
                </div>
                {genderEditing && (
                  <div className="mt-3 flex gap-2">
                    <select
                      value={genderValue}
                      onChange={(e) => setGenderValue(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">{t("profile_prefer_not_to_say")}</option>
                      <option value="male">{t("profile_male")}</option>
                      <option value="female">{t("profile_female")}</option>
                      <option value="other">{t("profile_other")}</option>
                    </select>
                    <button
                      onClick={() => handleSaveProfile("gender", genderValue)}
                      disabled={genderSaving}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      {genderSaving ? t("saving") : t("save")}
                    </button>
                    <button
                      onClick={() => setGenderEditing(false)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg text-sm transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                )}
              </div>

              {/* Birth Year */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">{t("profile_birth_year")}</span>
                  {!birthyearEditing && (
                    <div className="flex items-center gap-3">
                      {user.birthyear ? (
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{user.birthyear}</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-sm italic">{t("not_set")}</span>
                      )}
                      <button
                        onClick={() => { setBirthyearValue(user.birthyear ?? ""); setBirthyearEditing(true) }}
                        className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                      >
                        {user.birthyear ? t("change") : t("set")}
                      </button>
                    </div>
                  )}
                </div>
                {birthyearEditing && (
                  <div className="mt-3 flex gap-2">
                    <select
                      value={birthyearValue}
                      onChange={(e) => setBirthyearValue(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">{t("profile_select_year")}</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 10 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSaveProfile("birthyear", birthyearValue)}
                      disabled={birthyearSaving}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      {birthyearSaving ? t("saving") : t("save")}
                    </button>
                    <button
                      onClick={() => setBirthyearEditing(false)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg text-sm transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications toggle */}
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {notifEnabled ? (
                    <Bell className="w-4 h-4 text-amber-500" />
                  ) : (
                    <BellOff className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-400 font-medium">
                    {t("profile_notifications")}
                  </span>
                </div>
                {notifDenied ? (
                  <span className="text-xs text-red-400 italic">{t("profile_notif_denied")}</span>
                ) : (
                  <button
                    onClick={handleToggleNotifications}
                    disabled={notifLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                      notifEnabled ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                )}
              </div>

              {profileError && <p className="px-6 pb-4 text-red-500 text-xs">{profileError}</p>}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
              <span className="text-sm font-semibold text-gray-400">{t("profile_account_details")}</span>
            </div>

            <div className="px-6 py-10 flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 flex items-center justify-center">
                <LogIn className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-semibold text-base mb-1">{t("profile_not_signed_in")}</p>
                <p className="text-gray-400 text-sm">{t("profile_sign_in_prompt")}</p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t("profile_go_to_login")}
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 pb-8 text-center text-gray-500 dark:text-gray-600 text-xs">
        {t("powered_by")}
      </div>
    </main>
    </AuthGuard>
  )
}
