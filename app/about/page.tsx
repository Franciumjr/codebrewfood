import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const AboutPage = () => {
  return (
    <div>
      <Link href="/"><ChevronLeft></ChevronLeft></Link>
      AboutPage
    </div>
  )
}

export default AboutPage