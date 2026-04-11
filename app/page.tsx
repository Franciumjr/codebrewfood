"use client"
import { ModeToggle } from "@/components/ModeToggle"
import Sidebar from "@/components/ui/sidebar"
import Post from "@/components/Post"

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row justify-between min-h-screen pb-16 md:pb-0">
      <div className="z-50 md:sticky md:top-0 h-fit">
        <Sidebar></Sidebar> {/**sidebar */}
      </div>
      <Post></Post>
      <div className="fixed top-4 right-4 z-50 md:z-auto flex gap-2 md:m-4 lg:p-0">
        <ModeToggle></ModeToggle> {/**light / dark mode */}
      </div>
    </div>
  )
}
