"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Timer, Heart, Bookmark, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import User from './ui/user';
import Link from 'next/link';

const POSTS_PER_PAGE = 5;

const SinglePost = ({ post }: { post: any }) => {
    // Initialize Supabase inside the component
    const supabase = getSupabaseBrowserClient();

    // States for Bookmarks (Saves)
    const [save, setSave] = useState(false);
    const [savedCounter, setSavedCounter] = useState(post.intBookmarks || 0);

    // States for Likes
    const [like, setLike] = useState(false);
    const [likedCounter, setLikedCounter] = useState(post.intLikes || 0);

    const postId = post.idPost || post.id;

    // --- LIKE LOGIC ---
    const handleLike = async () => {
        const newLikeState = !like;
        const newCount = newLikeState ? likedCounter + 1 : likedCounter - 1;

        // Optimistic UI Update (Instant feedback)
        setLike(newLikeState);
        setLikedCounter(newCount);

        // Background Database Update
        const { error } = await supabase
            .from('tblPosts')
            .update({ intLikes: newCount })
            .eq('idPost', postId);

        // Revert if database fails
        if (error) {
            console.error("Failed to update like:", error);
            setLike(!newLikeState);
            setLikedCounter(likedCounter); 
        }
    };

    // --- BOOKMARK LOGIC ---
    const handleSave = async () => {
        const newSaveState = !save;
        const newCount = newSaveState ? savedCounter + 1 : savedCounter - 1;

        // Optimistic UI Update (Instant feedback)
        setSave(newSaveState);
        setSavedCounter(newCount);

        // Background Database Update
        const { error } = await supabase
            .from('tblPosts')
            .update({ intBookmarks: newCount }) // Assuming your column is intBookmarks
            .eq('idPost', postId);

        // Revert if database fails
        if (error) {
            console.error("Failed to update bookmark:", error);
            setSave(!newSaveState);
            setSavedCounter(savedCounter);
        }
    };

    return (
        <div className='w-64 md:w-128 flex flex-col mb-4'>
            
            {/* Header: Title and Time */}
            <div className='flex justify-between items-center mb-3 px-1 w-full'>
                <Link href={`/food-details?id=${postId}`}>
                    <h1 className='text-2xl font-bold hover:underline cursor-pointer'>{post.txtTitle}</h1>
                </Link>

                <div className='flex gap-2 items-center text-muted-foreground'>
                    <Timer className="w-5 h-5" />
                    <p className='text-md font-medium'>{post.intTime} min</p> 
                </div>
            </div>

            {/* Image */}
            <Link href={`/food-details?id=${postId}`}>
                <img 
                    src={post.txtImageURL} 
                    alt={post.txtTitle} 
                    className='cursor-pointer rounded-3xl w-full aspect-square object-cover transition-all hover:opacity-85 shadow-sm' 
                />
            </Link>

            {/* Action Buttons */}
            <div className="flex justify-around items-center mt-4">
                
                {/* LIKE BUTTON */}
                <div className='flex gap-2 items-center cursor-pointer group' onClick={handleLike}>
                    {like ? (
                        <Heart className="fill-destructive text-destructive transition-all scale-110" /> 
                    ) : (
                        <Heart className="text-foreground group-hover:text-destructive transition-all" />
                    )}
                    <p className='text-md font-medium'>{likedCounter}</p>
                </div>

                {/* BOOKMARK BUTTON */}
                <div className='flex gap-2 items-center cursor-pointer group' onClick={handleSave}>
                    {save ? (
                        <Bookmark className="fill-primary text-primary transition-all scale-110" /> 
                    ) : (
                        <Bookmark className="text-foreground group-hover:text-primary transition-all" />
                    )}
                    <p className='text-md font-medium'>{savedCounter}</p>
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