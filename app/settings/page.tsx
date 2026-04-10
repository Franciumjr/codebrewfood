import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const page = () => {
  return (
    <div>
        <Link href="/"><ChevronLeft></ChevronLeft></Link>
    </div>
  )
}

export default page