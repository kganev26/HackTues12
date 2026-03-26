"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

const API_URL = "http://172.20.10.6:5500"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const body: Record<string, string> = {
      username: formData.username,
      password: formData.password,
    }

    if (!isLogin) {
      body.firstname = formData.firstname
      body.lastname = formData.lastname
    }

    try {
      const endpoint = isLogin ? "/login" : "/register"
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Request failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("currentUser", JSON.stringify(data.user))
      router.push("/profile")
    } catch {
      setError("Cannot connect to server")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://scx2.b-cdn.net/gfx/news/hires/2024/farming.jpg')` 
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Back Link */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>
      
      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md px-5">
        <div className="bg-card rounded-3xl shadow-2xl p-12 text-center">
          <h1 className="text-5xl font-black text-gray-600 tracking-tight mb-0">
            Gaia
          </h1>
          
          <h2 className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-8">
            {isLogin ? "Login" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder=" "
                    required={!isLogin}
                    className="peer w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-green-700 transition-colors text-foreground bg-card"
                  />
                  <label className="absolute left-4 top-3 text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:left-1 peer-focus:text-xs peer-focus:text-green-700 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-700 peer-[:not(:placeholder-shown)]:font-bold">
                    First Name
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder=" "
                    required={!isLogin}
                    className="peer w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-green-700 transition-colors text-foreground bg-card"
                  />
                  <label className="absolute left-4 top-3 text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:left-1 peer-focus:text-xs peer-focus:text-green-700 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-700 peer-[:not(:placeholder-shown)]:font-bold">
                    Last Name
                  </label>
                </div>
              </>
            )}
            
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-green-700 transition-colors text-foreground bg-card"
              />
              <label className="absolute left-4 top-3 text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:left-1 peer-focus:text-xs peer-focus:text-green-700 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-700 peer-[:not(:placeholder-shown)]:font-bold">
                Username
              </label>
            </div>
            
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-green-700 transition-colors text-foreground bg-card"
              />
              <label className="absolute left-4 top-3 text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:left-1 peer-focus:text-xs peer-focus:text-green-700 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-700 peer-[:not(:placeholder-shown)]:font-bold">
                Password
              </label>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-4 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          
          <p className="mt-6 text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-green-700 font-bold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
