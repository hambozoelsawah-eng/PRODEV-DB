"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { Database } from "lucide-react"
import Link from "next/link"

export function DesignerNav() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg">DbDesigner</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
