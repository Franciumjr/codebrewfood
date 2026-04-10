import React from 'react'
import Link from 'next/link'


import {House,Search,Bell,Plus,User,Settings} from 'lucide-react'
const sidebars = [
    {
        title: "Home",
        href: "/",
        icon: House,
    },
    {
        title: "Search",
        href: "/search",
        icon: Search,
    },
    {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        title: "Create",
        href: "/create",
        icon: Plus,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]


const sidebar = () => {
  return (  
    <div className='flex flex-col'>
        {sidebars.map((sidebar)=>{
            return(
                <div key={sidebar.title} className='flex gap-2.5 p-2'>
                    <Link href={sidebar.href}>{sidebar.title}<sidebar.icon /></Link>
                </div>
            )
        })}
    </div>
  )
}

export default sidebar