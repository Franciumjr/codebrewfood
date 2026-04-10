"use client"

import { User } from "@supabase/supabase-js"
import { useState } from "react"
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type EmailLoginProps = {
  user: User | null;
}

type Mode = "signup" | "login"

export default function EmailLogin({ user }: EmailLoginProps) {
  const [mode, setMode] = useState("signup")

  return (
    <form>
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
        <div className="flex items-center justify-center">
          <h3>
            {mode === "signup" ? "Create an account" : "Log in to your account"}
          </h3>
        </div>
      </div>
    </form>
  )
}