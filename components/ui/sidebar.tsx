"use client"

import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { House, Search, Bell, Plus, User, Settings } from 'lucide-react'

// sidebar content
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



const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <>
        <div className="fixed bottom-0 left-0 w-full bg-background border-t z-50 md:sticky md:top-0 md:h-fit md:w-auto md:bg-transparent md:border-none md:z-auto">
            
            <div
                className='flex flex-row justify-around md:flex-col md:w-fit bg-background md:bg-transparent'
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                
                {/**rendering sidebar content */}
                
                {sidebars.map((item) => {
                    return (
                        <div key={item.title} className='flex gap-2.5 p-2 transition-all flex-1 md:flex-none'>
                            <Link className='flex justify-center md:justify-start items-center gap-4 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all rounded-sm p-2 w-full text-nowrap' href={item.href}>
                                <item.icon />
                                <span className={isExpanded ? 'hidden md:block' : 'hidden'}>
                                    {item.title}
                                </span>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}

export default Sidebar