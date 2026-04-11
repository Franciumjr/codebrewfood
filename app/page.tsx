"use client"
import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/ModeToggle"
import Sidebar from "@/components/ui/sidebar"
import Post from "@/components/Post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { User } from "@supabase/supabase-js"

export default function Page() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row justify-between min-h-screen pb-16 md:pb-0">
      <div className="z-50 md:sticky md:top-0 h-fit">
        <Sidebar></Sidebar> {/**sidebar */}
      </div>
      <Post></Post>
      <div className="fixed top-4 right-4 z-50 md:z-auto flex gap-2 md:m-4 lg:p-0">
        <ModeToggle></ModeToggle> {/**light / dark mode */}
        <Link href="/email-login">
          <Button size="lg">
            {user ? "Sign Out" : "Sign In"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
