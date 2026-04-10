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
        <div 
            className='flex flex-col w-fit'
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/**rendering sidebar content */}
            {sidebars.map((item) => {
                return (
                    <div key={item.title} className='flex gap-2.5 p-2 transition-all '> 
                        <Link className=' flex items-center gap-2 hover:bg-zinc-200 transition-all rounded-sm p-2 w-full text-nowrap ' href={item.href}>
                            <item.icon />
                            <span className={isExpanded ? 'block' : 'hidden'}>
                                {item.title}
                            </span>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Sidebar