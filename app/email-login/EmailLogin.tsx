"use client"

import { User } from "@supabase/supabase-js"
import { useState } from "react"

type EmailLoginProps = {
  user: User | null;
}

type Mode = "signup" | "login"

export default function EmailLogin({ user }: EmailLoginProps) {
  const [mode, setMode] = useState("signup")

  return (
    <div>
        EmailLogin
    </div>
  )
}