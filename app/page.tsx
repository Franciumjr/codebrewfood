"use client"
import { ModeToggle } from "@/components/ModeToggle"
import Sidebar from "@/components/ui/sidebar"

export default function Page() {
  return (
    <div className="flex justify-between min-h-screen">
      <Sidebar></Sidebar> {/**sidebar */}
      <div className="flex gap-2">
      <ModeToggle></ModeToggle> {/**light / dark mode */}
        </div>
    </div>
  )
}
