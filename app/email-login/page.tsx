import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import EmailLogin from "./EmailLogin"
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


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
    </div>
  )
}

export default page