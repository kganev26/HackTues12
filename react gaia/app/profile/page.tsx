"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogOut, User } from "lucide-react"

const API_URL = "http://172.20.10.6:5500"

interface CurrentUser {
  id: number
  username: string
  firstname: string
  lastname: string
  mac_address: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [macInput, setMacInput] = useState("")
  const [macEditing, setMacEditing] = useState(false)
  const [macError, setMacError] = useState("")
  const [macSaving, setMacSaving] = useState(false)
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
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Username</span>
                <span className="text-gray-900 font-semibold">@{user.username}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">First Name</span>
                <span className="text-gray-900 font-semibold">{user.firstname}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Last Name</span>
                <span className="text-gray-900 font-semibold">{user.lastname}</span>
              </div>

              {/* MAC Address row */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">MAC Address</span>
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
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">You are not signed in.</p>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="px-8 pb-8 text-center text-gray-300 text-xs">
        Powered by Grafana · TimescaleDB · GAIA Smart Farm
      </div>
    </main>
  )
}
