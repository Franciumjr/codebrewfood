import React from 'react'
import { ChevronLeft, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import PostGrid from '@/components/PostGrid'

const userStats = [
    {
        title: "Recipes",
        value: "10",
    },
    {
        title: "Followers",
        value: "1B",
    },

]
const ProfilePage = () => {

    return (
        <main>
            <section className='flex flex-col gap-4'>
                {/**nav bar */}
                <nav className='flex justify-between items-center font-bold'>
                    <Link href="/"><ChevronLeft></ChevronLeft></Link>
                    <h1 style={{ fontSize: '44x', fontWeight: "bold" }}>Joshua Kulik</h1>
                    <Settings></Settings>
                </nav>

                {/**profile image */}
                <div className='flex justify-center item-center my-4'>
                    <img className='rounded-full' style={{ width: "144px", height: "144px", objectFit: "cover" }} src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />

                </div>

                {/**user stats */}
                <div className='flex justify-center item-center my-4 gap-4'>
                    {userStats.map((item) => {
                        return (
                            <div key={item.title}>
                                <h1 style={{ fontSize: "20px" }}>{item.title}</h1>
                                <p style={{ fontSize: "20px", textAlign: "center" }}>{item.value}</p>
                            </div>
                        )
                    })}
                </div>

                {/**posts and saved */}
                <section className=' flex gap-4 items-center justify-center font-semibold '>
                    <Link href="" >POSTS</Link>
                    <Link className='text-zinc-500' href="" >SAVED</Link>
                </section>

                <PostGrid />
            </section>
        </main>

    )
}

export default ProfilePage