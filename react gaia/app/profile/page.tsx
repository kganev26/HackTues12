"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogOut, User, LogIn } from "lucide-react"

const API_URL = "/api"

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
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    // Fetch fresh profile data from backend (so mac_address is always current)
    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data)
        localStorage.setItem("currentUser", JSON.stringify(data))
      })
      .catch(() => {
        // Fallback to cached localStorage data
        const stored = localStorage.getItem("currentUser")
        if (stored) setUser(JSON.parse(stored))
      })
  }, [])

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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-5 flex items-center gap-4">
        <span className="text-3xl font-black text-amber-500 tracking-widest">GAIA</span>
        <div className="w-px h-6 bg-gray-300" />
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          Profile
        </span>
      </div>

      {/* Back link */}
      <div className="px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Content */}
      <div className="px-8 py-10 flex justify-center">
        {user ? (
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <User className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Account Details</span>
              <button
                onClick={handleSignOut}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>

            {/* Fields */}
            <div className="divide-y divide-gray-100">
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">Username</span>
                <span className="text-gray-900 font-semibold">@{user.username}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">First Name</span>
                <span className="text-gray-900 font-semibold">{user.firstname}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">Last Name</span>
                <span className="text-gray-900 font-semibold">{user.lastname}</span>
              </div>

              {/* MAC Address row */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">MAC Address</span>
                  {!macEditing && (
                    <div className="flex items-center gap-3">
                      {user.mac_address ? (
                        <span className="text-gray-900 font-semibold font-mono">{user.mac_address}</span>
                      ) : (
                        <span className="text-gray-300 text-sm italic">Not set</span>
                      )}
                      <button
                        onClick={() => { setMacInput(user.mac_address ?? ""); setMacEditing(true); setMacError("") }}
                        className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                      >
                        {user.mac_address ? "Change" : "Set"}
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
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm font-mono placeholder:text-gray-300 outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      onClick={handleSaveMac}
                      disabled={macSaving || !macInput.trim()}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      {macSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setMacEditing(false); setMacError("") }}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {macError && <p className="mt-2 text-red-500 text-xs">{macError}</p>}
              </div>

              {/* Agriculture */}
              {user.agriculture && (
                <div className="px-6 py-4">
                  <span className="text-xs uppercase tracking-widest text-gray-700 font-medium block mb-2">Agriculture</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user.agriculture.split(",").map((a) => (
                      <span key={a} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold capitalize">
                        {a.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Country / Province */}
              {(user.country || user.province) && (
                <div className="px-6 py-4 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">Region</span>
                  <span className="text-gray-900 font-semibold text-right">
                    {[user.province, user.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}

              {/* Gender */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">Gender</span>
                  {!genderEditing && (
                    <div className="flex items-center gap-3">
                      {user.gender ? (
                        <span className="text-gray-900 font-semibold capitalize">{user.gender.replace(/_/g, " ")}</span>
                      ) : (
                        <span className="text-gray-300 text-sm italic">Not set</span>
                      )}
                      <button
                        onClick={() => { setGenderValue(user.gender ?? ""); setGenderEditing(true) }}
                        className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                      >
                        {user.gender ? "Change" : "Set"}
                      </button>
                    </div>
                  )}
                </div>
                {genderEditing && (
                  <div className="mt-3 flex gap-2">
                    <select
                      value={genderValue}
                      onChange={(e) => setGenderValue(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      onClick={() => handleSaveProfile("gender", genderValue)}
                      disabled={genderSaving}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      {genderSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setGenderEditing(false)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Birth Year */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-700 font-medium">Birth Year</span>
                  {!birthyearEditing && (
                    <div className="flex items-center gap-3">
                      {user.birthyear ? (
                        <span className="text-gray-900 font-semibold">{user.birthyear}</span>
                      ) : (
                        <span className="text-gray-300 text-sm italic">Not set</span>
                      )}
                      <button
                        onClick={() => { setBirthyearValue(user.birthyear ?? ""); setBirthyearEditing(true) }}
                        className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                      >
                        {user.birthyear ? "Change" : "Set"}
                      </button>
                    </div>
                  )}
                </div>
                {birthyearEditing && (
                  <div className="mt-3 flex gap-2">
                    <select
                      value={birthyearValue}
                      onChange={(e) => setBirthyearValue(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">Select year</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 10 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSaveProfile("birthyear", birthyearValue)}
                      disabled={birthyearSaving}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      {birthyearSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setBirthyearEditing(false)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {profileError && <p className="px-6 pb-4 text-red-500 text-xs">{profileError}</p>}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <span className="text-sm font-semibold text-gray-400">Account Details</span>
            </div>

            {/* Body */}
            <div className="px-6 py-10 flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                <LogIn className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold text-base mb-1">You are not signed in</p>
                <p className="text-gray-400 text-sm">Sign in to view and manage your account details.</p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Go to Login
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="px-8 pb-8 text-center text-gray-500 text-xs">
        Powered by Grafana · TimescaleDB · GAIA Smart Farm
      </div>
    </main>
  )
}
