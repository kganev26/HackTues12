"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"

const API_URL = "http://10.210.46.104:5500"

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
    customAgriculture: "",
    country: "",
    province: "",
  })
  const router = useRouter()
  const { t } = useLanguage()

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
      const allCrops = [...formData.agriculture]
      if (formData.agriculture.includes("other") && formData.customAgriculture.trim()) {
        allCrops.splice(allCrops.indexOf("other"), 1)
        allCrops.push(...formData.customAgriculture.split(",").map((s) => s.trim()).filter(Boolean))
      }
      body.agriculture = allCrops.join(",")
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
      router.push("/sensors")
    } catch {
      setError("Cannot connect to server")
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setStep(1)
    setError("")
  }

  const floatingLabel = "absolute left-4 top-3 text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:left-1 peer-focus:text-xs peer-focus:text-green-700 dark:peer-focus:text-green-400 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-700 dark:peer-[:not(:placeholder-shown)]:text-green-400 peer-[:not(:placeholder-shown)]:font-bold"
  const inputClass = "peer w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors text-foreground bg-card"

  const agricultureOptions = [
    { value: "tomatoes", key: "login_tomatoes" as const },
    { value: "potatoes", key: "login_potatoes" as const },
    { value: "cucumbers", key: "login_cucumbers" as const },
    { value: "peppers", key: "login_peppers" as const },
    { value: "wheat", key: "login_wheat" as const },
    { value: "corn", key: "login_corn" as const },
    { value: "sunflower", key: "login_sunflower" as const },
    { value: "grapes", key: "login_grapes" as const },
    { value: "apples", key: "login_apples" as const },
    { value: "watermelon", key: "login_watermelon" as const },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://scx2.b-cdn.net/gfx/news/hires/2024/farming.jpg')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Logo link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 text-3xl font-black text-amber-400 tracking-widest hover:opacity-80 transition-opacity animate-fade-in"
        style={{ animationDelay: '0ms' }}
      >
        GAIA
      </Link>

      {/* Form Container */}
      <div
        className="relative z-10 w-full max-w-md px-5 animate-fade-up"
        style={{ animationDelay: '150ms' }}
      >
        <div className="bg-card rounded-3xl shadow-2xl p-12 text-center border border-transparent dark:border-gray-700">
          <h1
            className="text-5xl font-black text-gray-600 dark:text-gray-300 tracking-tight mb-0 animate-fade-up"
            style={{ animationDelay: '250ms' }}
          >
            Gaia
          </h1>

          <h2
            className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-8 animate-fade-in"
            style={{ animationDelay: '350ms' }}
          >
            {isLogin ? t("login_title") : step === 1 ? t("login_create_account") : t("login_about_you")}
          </h2>

          {/* Step indicator for registration */}
          {!isLogin && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`h-2 w-8 rounded-full transition-colors ${step === 1 ? "bg-green-700" : "bg-green-200 dark:bg-green-900"}`} />
              <div className={`h-2 w-8 rounded-full transition-colors ${step === 2 ? "bg-green-700" : "bg-green-200 dark:bg-green-900"}`} />
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
                    <label className={floatingLabel}>{t("login_first_name")}</label>
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
                    <label className={floatingLabel}>{t("login_last_name")}</label>
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
                <label className={floatingLabel}>{t("login_username")}</label>
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
                <label className={floatingLabel}>{t("login_password")}</label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                {isLogin ? t("login_button") : t("login_continue")}
              </button>
            </form>
          )}

          {/* Step 2: Profile info */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              {/* Agriculture */}
              <div>
                <label className="block text-left text-xs text-green-700 dark:text-green-400 font-bold mb-2 ml-1">
                  {t("login_agriculture_label")}
                </label>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {agricultureOptions.map(({ value, key }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agriculture.includes(value)}
                        onChange={() => handleAgricultureChange(value)}
                        className="accent-green-700 w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{t(key)}</span>
                    </label>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={formData.agriculture.includes("other")}
                    onChange={() => handleAgricultureChange("other")}
                    className="accent-green-700 w-4 h-4"
                  />
                  <span className="text-sm text-foreground">{t("login_other")}</span>
                </label>
                {formData.agriculture.includes("other") && (
                  <input
                    type="text"
                    placeholder={t("login_other_placeholder")}
                    value={formData.customAgriculture}
                    onChange={(e) => setFormData({ ...formData, customAgriculture: e.target.value })}
                    className="mt-2 w-full px-4 py-2 border-2 border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors text-foreground bg-card text-sm"
                  />
                )}
              </div>

              {/* Country */}
              <div className="relative">
                <label className="block text-left text-xs text-green-700 dark:text-green-400 font-bold mb-1 ml-1">
                  {t("login_country")}
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors text-foreground bg-card appearance-none"
                >
                  <option value="" disabled>{t("login_select_country")}</option>
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
                <label className={floatingLabel}>{t("login_province")}</label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError("") }}
                  className="flex-1 py-2.5 border-2 border-green-700 text-green-700 dark:text-green-400 dark:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl font-semibold text-sm transition-all duration-300"
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t("login_finish")}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <p className="mt-6 text-sm text-muted-foreground">
              {isLogin ? t("login_no_account") : t("login_has_account")}
              <button
                onClick={switchMode}
                className="ml-1 text-green-700 dark:text-green-400 font-bold hover:underline"
              >
                {isLogin ? t("login_register") : t("login_button")}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
