"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Timer, Heart, Bookmark, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import User from './ui/user';
import Link from 'next/link';

const POSTS_PER_PAGE = 5;

// Updated to use your actual Supabase database column names
const SinglePost = ({ post }: { post: any }) => {
    const [save, setSave] = useState(false);
    // Assuming you'll add likes/saves to the DB later, defaulting to 0 for now
    const [savedCounter, setSavedCounter] = useState(post.intSaves || 0);

    const [like, setLike] = useState(false);
    const [likedCounter, setLikedCounter] = useState(post.intLikes || 0);

    return (
        <div className='w-64 h-[70vh] md:w-128 md:h-[100vh] scroll-smooth flex flex-col'>
            <div className='flex gap-4 justify-between items-center my-6'>
                <h1 className='text-2xl font-bold'>{post.txtTitle}</h1>
                <div className='flex gap-2 items-center'>
                    <Timer></Timer>
                    <p className='text-md text-right'>{post.intTime} min</p> 
                </div>
            </div>
            <img src={post.txtImageURL} alt={post.txtTitle} className='mb-4 cursor-pointer rounded-3xl brightness-90 w-full aspect-square object-cover' />
            <div className='flex justify-around gap-8 translate-x-1 md:translate-x-0 my-4'>
                
                
            </div>
            <div className="flex justify-around items-center">
                <div className='flex gap-2 items-center cursor-pointer'
                    onClick={() => {
                        setLike(!like);
                        setLikedCounter(like ? likedCounter - 1 : likedCounter + 1);
                    }}
                >
                    {like ? <Heart fill='red' color='none' /> : <Heart />}
                    <p className='text-md'>{likedCounter}</p>
                </div>
                <div className='flex gap-2 items-center cursor-pointer'
                    onClick={() => {
                        setSave(!save);
                        setSavedCounter(save ? savedCounter - 1 : savedCounter + 1);
                    }}>
                    {save ? <Bookmark fill='blue' color='none' /> : <Bookmark />}
                    <p className='text-md'>{savedCounter}</p>
                </div>
            </div>
        </div>
    )
}

const Post = () => {
    const supabase = getSupabaseBrowserClient();
    
    // State for our posts and pagination
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // This sets up a 'ref' we can attach to a div. 
    // 'inView' becomes true when that div scrolls onto the screen.
    const { ref, inView } = useInView({
        threshold: 0, // Trigger as soon as 1 pixel of the div is visible
    });

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const from = page * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;

        // Fetch the specific chunk of posts
        const { data, error } = await supabase
            .from('tblPosts')
            .select('*')
            .order('datCreatedAt', { ascending: false }) // Show newest first
            .range(from, to);

        if (error) {
            console.error("Error fetching posts:", error);
        } else if (data) {
            // If we got fewer posts than requested, we've hit the end of the database
            if (data.length < POSTS_PER_PAGE) {
                setHasMore(false);
            }
            
            // Append the new posts to the existing array
            setPosts((prevPosts) => [...prevPosts, ...data]);
            setPage((prevPage) => prevPage + 1);
        }
        
        setLoading(false);
    }, [page, loading, hasMore, supabase]);

    // This useEffect listens to the 'inView' boolean. 
    // Whenever the loading spinner becomes visible, fetch more posts!
    useEffect(() => {
        if (inView) {
            fetchPosts();
        }
    }, [inView, fetchPosts]);

    return (
        <div className="flex flex-col items-center w-full mt-24">
            {posts.map((post) => (
                <div key={post.id} className="flex flex-col items-start w-64 md:w-128 mt-24">
                    <User />    
                    <Link href="/food-details">
                        <SinglePost post={post} />
                    </Link>
                </div>
            ))}

            {/* The Invisible Trigger / Loading Spinner */}
            {hasMore && (
                <div ref={ref} className="mt-10 mb-24 flex justify-center">
                    <Loader2 className="animate-spin text-zinc-500 size-8" />
                </div>
            )}
            
            {!hasMore && posts.length > 0 && (
                <p className="mt-10 mb-24 text-zinc-500">You've caught up on all posts!</p>
            )}
        </div>
    )
}

export default Post