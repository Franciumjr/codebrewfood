import { ModeToggle } from "@/components/ModeToggle"
import Sidebar from "@/components/ui/sidebar"
import {SignIn, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <Sidebar></Sidebar>
      <ModeToggle></ModeToggle>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
    </div>
  )
}
