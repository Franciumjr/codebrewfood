"use client"
import React, { useState } from 'react'
import { Timer, Heart, Bookmark } from 'lucide-react';
import User from './ui/user';


//dummy data
const posts = [
    {
        img: 'https://picsum.photos/id/1/1024/768',
        name: 'Butter Chicken',
        time: '30 min',
        likes: 300,
        saves: 100,

    },
    {
        img: 'https://picsum.photos/id/14/1024/768',
        name: 'Katsu Curry Don',
        time: '20 min',
        likes: 200,
        saves: 50,
    },
    {
        img: 'https://picsum.photos/id/56/1024/768',
        name: 'Dal Makhani',
        time: '40 min',
        likes: 400,
        saves: 150,
    },
    {
        img: 'https://picsum.photos/id/45/1024/768',
        name: 'Pasta Carbonara',
        time: '25 min',
        likes: 350,
        saves: 120,
    },
    {
        img: 'https://picsum.photos/id/98/1024/768',
        name: 'Sushi Platter',
        time: '35 min',
        likes: 500,
        saves: 200,
    },
    {
        img: 'https://picsum.photos/id/67/1024/768',
        name: 'Ramen Bowl',
        time: '30 min',
        likes: 1000,
        saves: 110,
    },
    {
        img: 'https://picsum.photos/id/7/1024/768',
        name: 'Pasta Carbonara',
        time: '25 min',
        likes: 350,
        saves: 120,
    },
    {
        img: 'https://picsum.photos/id/8/1024/768',
        name: 'Sushi Platter',
        time: '35 min',
        likes: 500,
        saves: 200,
    },
    {
        img: 'https://picsum.photos/id/101/1024/768',
        name: 'Penang Laksa',
        time: '30 min',
        likes: 350,
        saves: 120,
    },
    {
        img: 'https://picsum.photos/id/10/1024/768',
        name: 'Nasi Lemak',
        time: '30 min',
        likes: '320',
        saves: '110',
    },
];




const SinglePost = ({ post }: { post: any }) => {
    //liked / saved logic
    const [save, setSave] = useState(false);
    const [savedCounter, setSavedCounter] = useState(Number(post.saves));

    const [like, setLike] = useState(false);
    const [likedCounter, setLikedCounter] = useState(Number(post.likes));

    return (
        <div className=' w-64 h-[70vh] md:w-128 md:h-[100vh] mt-24 scroll-smooth'>
            <img src={post.img} alt="" className=' cursor-pointer rounded-3xl brightness-50 w-full aspect-square object-cover' />
            <div className='text-white flex justify-center gap-8 translate-y-[-150%] translate-x-1 md:translate-x-0'>
                <h1 className=' text-2xl font-bold'>{post.name}</h1>
                <div className='flex gap-2'>
                    <Timer></Timer><p className='text-md'>{post.time}</p>
                </div>
            </div>
            <div className="flex justify-around ">
                <div className='flex gap-2 items-center cursor-pointer'
                    
                    onClick={() => {
                        setLike(!like);
                        setLikedCounter(like ? likedCounter - 1 : likedCounter + 1);
                    }}
                >
                    {like ? <Heart fill='red' color='none'></Heart> : <Heart></Heart>}
                    <p className='text-md'>{likedCounter}</p>
                </div>
                <div className='flex gap-2 items-center cursor-pointer'
                    
                    onClick={() => {
                        setSave(!save);
                        setSavedCounter(save ? savedCounter - 1 : savedCounter + 1);
                    }}>
                    {save ? <Bookmark fill='blue' color='none'></Bookmark> : <Bookmark></Bookmark>}
                    <p className='text-md'>{savedCounter}</p>
                </div>
            </div>
        </div>
    )
}

const Post = () => {
    return (
        <div className="flex flex-col items-center w-full">
            {posts.map((post) => (
                <>
                <User></User>
                <SinglePost key={post.img} post={post} />
                </>
            ))}
        </div>
    )
}

export default Post