import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const page = () => {
  return (
    <div>
      <div>
        <Link href="/"><ChevronLeft /></Link>
      </div>
      <div className="flex items-center justify-center h-screen">
        Test
      </div>
    </div>
  )
}

export default page