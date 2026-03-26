"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

const API_URL = "/api"

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin","Bolivia","Bosnia and Herzegovina",
  "Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
  "Central African Republic","Chad","Chile","China","Colombia","Congo","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland",
  "France","Georgia","Germany","Ghana","Greece","Guatemala","Honduras","Hungary","Iceland","India","Indonesia",
  "Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait",
  "Kyrgyzstan","Latvia","Lebanon","Libya","Lithuania","Luxembourg","Malaysia","Mali","Malta","Mexico","Moldova",
  "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua",
  "Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palestine","Panama","Paraguay",
  "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia",
  "Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","South Sudan","Spain",
  "Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Tunisia",
  "Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay",
  "Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
]

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    agriculture: [] as string[],
    country: "",
    province: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAgricultureChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      agriculture: prev.agriculture.includes(value)
        ? prev.agriculture.filter((a) => a !== value)
        : [...prev.agriculture, value],
    }))
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (isLogin) {
      submitForm()
    } else {
      setStep(2)
    }
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    submitForm()
  }

  const submitForm = async () => {
    const body: Record<string, string> = {
      username: formData.username,
      password: formData.password,
    }

    if (!isLogin) {
      body.firstname = formData.firstname
      body.lastname = formData.lastname
      body.agriculture = formData.agriculture.join(",")
      body.country = formData.country
      body.province = formData.province
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
        if (!isLogin) setStep(1)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("currentUser", JSON.stringify(data.user))
      router.push("/profile")
    } catch {
      setError("Cannot connect to server")
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setStep(1)
    setError("")
  }

  const floatingLabel = "absolute left-4 top-3 text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:left-1 peer-focus:text-xs peer-focus:text-green-700 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-700 peer-[:not(:placeholder-shown)]:font-bold"
  const inputClass = "peer w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-green-700 transition-colors text-foreground bg-card"

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://scx2.b-cdn.net/gfx/news/hires/2024/farming.jpg')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Back Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors animate-fade-in"
        style={{ animationDelay: '0ms' }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Form Container */}
      <div
        className="relative z-10 w-full max-w-md px-5 animate-fade-up"
        style={{ animationDelay: '150ms' }}
      >
        <div className="bg-card rounded-3xl shadow-2xl p-12 text-center">
          <h1
            className="text-5xl font-black text-gray-600 tracking-tight mb-0 animate-fade-up"
            style={{ animationDelay: '250ms' }}
          >
            Gaia
          </h1>

          <h2
            className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-8 animate-fade-in"
            style={{ animationDelay: '350ms' }}
          >
            {isLogin ? "Login" : step === 1 ? "Create Account" : "About You"}
          </h2>

          {/* Step indicator for registration */}
          {!isLogin && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`h-2 w-8 rounded-full transition-colors ${step === 1 ? "bg-green-700" : "bg-green-200"}`} />
              <div className={`h-2 w-8 rounded-full transition-colors ${step === 2 ? "bg-green-700" : "bg-green-200"}`} />
            </div>
          )}

          {/* Step 1: Credentials */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className={inputClass}
                    />
                    <label className={floatingLabel}>First Name</label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className={inputClass}
                    />
                    <label className={floatingLabel}>Last Name</label>
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
                  className={inputClass}
                />
                <label className={floatingLabel}>Username</label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className={inputClass}
                />
                <label className={floatingLabel}>Password</label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                {isLogin ? "Login" : "Continue with the registration"}
              </button>
            </form>
          )}

          {/* Step 2: Profile info */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              {/* Agriculture */}
              <div>
                <label className="block text-left text-xs text-green-700 font-bold mb-2 ml-1">
                  What agricultures do you have?
                </label>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {[
                    { value: "crops", label: "Crops" },
                    { value: "vegetables", label: "Vegetables" },
                    { value: "fruits", label: "Fruits & Orchards" },
                    { value: "livestock", label: "Livestock" },
                    { value: "poultry", label: "Poultry" },
                    { value: "dairy", label: "Dairy Farming" },
                    { value: "aquaculture", label: "Aquaculture" },
                    { value: "greenhouse", label: "Greenhouse" },
                    { value: "mixed", label: "Mixed Farming" },
                    { value: "other", label: "Other" },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agriculture.includes(value)}
                        onChange={() => handleAgricultureChange(value)}
                        className="accent-green-700 w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div className="relative">
                <label className="block text-left text-xs text-green-700 font-bold mb-1 ml-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-green-700 transition-colors text-foreground bg-card appearance-none"
                >
                  <option value="" disabled>Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Province / State */}
              <div className="relative">
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className={inputClass}
                />
                <label className={floatingLabel}>Province / State</label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError("") }}
                  className="flex-1 py-2.5 border-2 border-green-700 text-green-700 hover:bg-green-50 rounded-xl font-semibold text-sm transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Finish your profile
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <p className="mt-6 text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-1 text-green-700 font-bold hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
