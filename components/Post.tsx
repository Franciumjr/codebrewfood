"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Timer, Heart, Bookmark, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import User from './ui/user';
import Link from 'next/link';

const POSTS_PER_PAGE = 5;

// Updated SinglePost with correct Links
const SinglePost = ({ post }: { post: any }) => {
    const [save, setSave] = useState(false);
    const [savedCounter, setSavedCounter] = useState(post.intBookmarks || 0);

    const [like, setLike] = useState(false);
    const [likedCounter, setLikedCounter] = useState(post.intLikes || 0);

    // Make sure we grab the right ID whether your database calls it 'id' or 'idPost'
    const postId = post.idPost || post.id;

    return (
        <div className='w-64 md:w-128 flex flex-col mb-4'>
            <Link href={`/food-details?id=${postId}`}>
                <img 
                    src={post.txtImageURL} 
                    alt={post.txtTitle} 
                    className='cursor-pointer rounded-3xl brightness-90 w-full aspect-square object-cover transition-all hover:brightness-75' 
                />
            </Link>

            <div className='text-white flex justify-center gap-8 translate-y-[-150%] translate-x-1 md:translate-x-0'>
                
                {/* 2. Only the title triggers the link */}
                <Link href={`/food-details?id=${postId}`}>
                    <h1 className='text-2xl font-bold hover:underline cursor-pointer'>{post.txtTitle}</h1>
                </Link>

                <div className='flex gap-2 items-center'>
                    <Timer />
                    <p className='text-md'>{post.intTime} min</p> 
                </div>
            </div>

            {/* 3. The buttons are completely separate from the links! */}
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
            // This grabs everything from the post, PLUS the Username from the connected tblUsers row
            .select(`
                *,
                tblUsers (
                    Username
                )
            `)
            .order('datCreatedAt', { ascending: false }) 
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
                <div key={post.idPost || post.id} className="flex flex-col items-start w-64 md:w-128 mb-16">
                    {/* The Username fetched from our Database Join! */}
                    <User username={post.tblUsers?.Username} />
                    
                    {/* Just the raw post component, no Link wrapper needed here anymore */}
                    <SinglePost post={post} />
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