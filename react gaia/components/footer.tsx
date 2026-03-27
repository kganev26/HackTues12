"use client"

import Link from "next/link"
import { Github, Mail, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#0a0f0c] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="text-5xl font-bold text-amber-400 tracking-wide">GAIA</span>
          </Link>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/kganev26/HackTues12"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://mail.google.com/mail/?view=cm&fs=1&to=petar.t.kavrakov.2024@elsys-bg.org"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </Link>
            <Link
              href="https://discord.gg/ATaKTAVft3"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Discord"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Gaia. {t("footer_rights")}
          </p>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
              {t("footer_home")}
            </Link>
            <Link href="/#features" className="text-white/40 hover:text-white text-sm transition-colors">
              {t("footer_features")}
            </Link>
            <Link href="/about" className="text-white/40 hover:text-white text-sm transition-colors">
              {t("footer_about")}
            </Link>
            <Link href="/login" className="text-white/40 hover:text-white text-sm transition-colors">
              {t("footer_login")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
