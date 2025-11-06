"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

export function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setIsLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return null
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/protected">
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user.email}</span>
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/sign-up">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  )
}
