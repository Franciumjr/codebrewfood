"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card"


type EmailLoginProps = {
  user: User | null;
}

export type Mode = "signup" | "login"

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
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setStatus(error.message)
      } else {
        setStatus("Signup successful! Please check your email for a confirmation link.")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setStatus(error.message)
      } else {
        setStatus("Login successful!")
      }
    }
  }

  return (
    <>
      <Card className="flex flex-col text-center justify-center items-center gap-6">

        {/* User who has not logged in */}
        {!currentUser && (
          <>
            <form className="" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-6 w-full max-w-sm flex-grow p-12">
                <div className="flex items-center bg-muted p-1 rounded-md gap-10 my-4">
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
                <div className="flex flex-col items-center justify-center gap-6 w-full">
                  <h3>
                    <b>{mode === "signup" ? "Create an account" : "Log in to your account"}</b>
                  </h3>
                  <label className="w-full text-left">
                    Email
                    <Input
                      className="mt-2"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="youremail@example.com"
                    />
                  </label>
                  <label className="w-full text-left">
                    Password
                    <Input
                      className="mt-2"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      placeholder="Password must be at least 6 characters"
                    />
                  </label>
                    
                </div>
              </div>
              <CardFooter className="w-full flex flex-col gap-10 mt-auto">
                      <Button type="submit" className="w-full">
                        {mode === "signup" ? "Sign Up" : "Login"}
                      </Button>
                  </CardFooter>
            </form>
          </>
        )}

        {/** logged In User */}
        {currentUser && (
          <>
            <div className="flex flex-col items-center gap-6 w-full max-w-sm p-12 flex-grow">
              <p>Welcome, {currentUser.email}!</p>
              <label>
                Change Username
                <Input
                className="mt-5"
                  type="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  placeholder="Will be Unnamed Taster if left blank"
                />
              </label>

              {status && (<p>{status}</p>)}
            </div>

            <CardFooter className="w-full flex flex-col gap-10 mt-auto">
              <Button type="submit" className="w-full" onClick={updateUsername}>
                Update username
              </Button>
              <Button variant="destructive" className="w-full" type="button" onClick={handleSignOut}>
                Sign Out
              </Button>
            </CardFooter>
          </>
        )}

        
      </Card>
    </>
  )

}