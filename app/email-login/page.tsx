import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import EmailLogin from "./EmailLogin"
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import { ModeToggle } from '@/components/ModeToggle'

const page = async () => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <div>
        <Link href="/"><ChevronLeft /></Link>
      </div>
      <div className="flex items-center justify-center h-screen">
        <EmailLogin user={null} />
      </div>
      <div className="fixed top-4 right-4 z-50 md:z-auto flex gap-2 md:m-4 lg:p-0">
        <ModeToggle></ModeToggle> {/**light / dark mode */} 
      </div>
    </div>
  )
}

export default page