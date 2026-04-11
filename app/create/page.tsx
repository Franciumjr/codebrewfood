import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PublishPost from './PublishPost'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import { read } from 'node:fs'


const page = async () => {
  const supabase = await createSupabaseServerClient(true)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <div>
        <Link href="/"><ChevronLeft /></Link>
      </div>
      <div className="flex items-center justify-center h-screen">
        <PublishPost user={user} />
      </div>
    </div>
  )
}

export default page