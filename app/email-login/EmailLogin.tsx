"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type EmailLoginProps = {
  user: User | null;
}

type Mode = "signup" | "login"

export default function EmailLogin({ user }: EmailLoginProps) {
  const [mode, setMode] = useState("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState("")
  const supabase = getSupabaseBrowserClient()
  const [currentUser, setCurrentUser] = useState<User | null>(user)

  async function handleSignOut() {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setStatus("Signed out successfully")
  }

  async function updateUsername() {
    if (!currentUser) return
    const { error } = await supabase
      .from("tblUsers")
      .update({ Username: username })
      .eq("id", currentUser.id)
    if (error) {
      setStatus(error.message)
    } else {
      setStatus("Username updated successfully")
    }
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null)
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [supabase])
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mode === "signup") {
      const {error} = await supabase.auth.signUp({ email, password })
      if (error) {
        setStatus(error.message)
      } else {
        setStatus("Signup successful! Please check your email for a confirmation link.") 
      }
    } else {
      const {error} = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setStatus(error.message)
      } else {
        setStatus("Login successful!")
      }
    }
  }

  return (
    <>
      {!currentUser && (
        <>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex items-center bg-muted p-1 rounded-md">
              {/* Signup */}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={cn(
                  "px-4 py-2 rounded-sm text-sm transition",
                  mode === "signup"
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Sign up
              </button>

              {/* Login */}
              <button
                type="button"
                onClick={() => setMode("login")}
                className={cn(
                  "px-4 py-2 rounded-sm text-sm transition",
                  mode === "login"
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Login
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3>
                <b>{mode === "signup" ? "Create an account" : "Log in to your account"}</b>
              </h3>
              <label>
                Email
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="youremail@example.com"
                />
              </label>
              <label>
                Password
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  placeholder="Password must be at least 6 characters"
                />
              </label>
              <Button type="submit" className="w-full">
                {mode === "signup" ? "Sign Up" : "Login"}
              </Button>
            </div>
          </div>
        </form>
        </>
      )}
      {currentUser && (
        <div>
          <p>Welcome, {currentUser.email}!</p>
          <label>
            Username
            <Input
              type="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              placeholder="Will show email if left blank"
            />
          </label>
          <Button type="submit" className="w-full" onClick={updateUsername}>
            Update username
          </Button>
          <Button type="button" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      )}
      {status && (<p>{status}</p>)}
    </>
  )
}