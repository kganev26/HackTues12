"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogOut, User } from "lucide-react"

interface CurrentUser {
  id: number
  username: string
  firstname: string
  lastname: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  useEffect(() => {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-5 flex items-center gap-4">
        <span className="text-3xl font-black text-amber-400 tracking-widest">GAIA</span>
        <div className="w-px h-6 bg-white/20" />
        <span className="text-white/60 text-sm font-medium uppercase tracking-widest">
          Profile
        </span>
      </div>

      {/* Back link */}
      <div className="px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Content */}
      <div className="px-8 py-10 flex justify-center">
        {user ? (
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#141414] overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <User className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-white/80">Account Details</span>
              <button
                onClick={handleSignOut}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>

            {/* Fields */}
            <div className="divide-y divide-white/10">
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40 font-medium">Username</span>
                <span className="text-white font-semibold">@{user.username}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40 font-medium">First Name</span>
                <span className="text-white font-semibold">{user.firstname}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40 font-medium">Last Name</span>
                <span className="text-white font-semibold">{user.lastname}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/50 text-sm mb-4">You are not signed in.</p>
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
      <div className="px-8 pb-8 text-center text-white/25 text-xs">
        Powered by Grafana · TimescaleDB · GAIA Smart Farm
      </div>
    </main>
  )
}
