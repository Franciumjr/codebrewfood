"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Timer, Heart, Bookmark, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import User from './ui/user';
import Link from 'next/link';

const POSTS_PER_PAGE = 5;

const SinglePost = ({ post }: { post: any }) => {
    const supabase = getSupabaseBrowserClient();

    const [save, setSave] = useState(false);
    const [savedCounter, setSavedCounter] = useState(post.intBookmarks || 0);

    const [like, setLike] = useState(false);
    const [likedCounter, setLikedCounter] = useState(post.intLikes || 0);

    const postId = post.idPost || post.id;

    const handleLike = async () => {
        const newLikeState = !like;
        const newCount = newLikeState ? likedCounter + 1 : likedCounter - 1;

        setLike(newLikeState);
        setLikedCounter(newCount);

        const { error } = await supabase
            .from('tblPosts')
            .update({ intLikes: newCount })
            .eq('idPost', postId);

        if (error) {
            console.error("Failed to update like:", error);
            setLike(!newLikeState);
            setLikedCounter(likedCounter); 
        }
    };

    const handleSave = async () => {
        const newSaveState = !save;
        const newCount = newSaveState ? savedCounter + 1 : savedCounter - 1;

        setSave(newSaveState);
        setSavedCounter(newCount);

        const { error } = await supabase
            .from('tblPosts')
            .update({ intBookmarks: newCount })
            .eq('idPost', postId);

        if (error) {
            console.error("Failed to update bookmark:", error);
            setSave(!newSaveState);
            setSavedCounter(savedCounter);
        }
    };

    return (
        <div className='w-64 md:w-128 flex flex-col mb-4'>
            
            <div className='flex justify-between items-center mb-3 px-1 w-full'>
                <Link href={`/food-details?id=${postId}`}>
                    <h1 className='text-2xl font-bold hover:underline cursor-pointer'>{post.txtTitle}</h1>
                </Link>

                <div className='flex gap-2 items-center text-muted-foreground'>
                    <Timer className="w-5 h-5" />
                    <p className='text-md font-medium'>{post.intTime} min</p> 
                </div>
            </div>

            <Link href={`/food-details?id=${postId}`}>
                <img 
                    src={post.txtImageURL} 
                    alt={post.txtTitle} 
                    className='cursor-pointer rounded-3xl w-full aspect-square object-cover transition-all hover:opacity-85 shadow-sm' 
                />
            </Link>
            <div className="flex justify-around items-center mt-4">    
                <div className='flex gap-2 items-center cursor-pointer group' onClick={handleLike}>
                    {like ? (
                        <Heart className="fill-destructive text-destructive transition-all scale-110" /> 
                    ) : (
                        <Heart className="text-foreground group-hover:text-destructive transition-all" />
                    )}
                    <p className='text-md font-medium'>{likedCounter}</p>
                </div>
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
    
    // Post variables
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const from = page * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;

        const { data, error } = await supabase
            .from('tblPosts')
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
            if (data.length < POSTS_PER_PAGE) {
                setHasMore(false);
            }
            
            setPosts((prevPosts) => [...prevPosts, ...data]);
            setPage((prevPage) => prevPage + 1);
        }
        
        setLoading(false);
    }, [page, loading, hasMore, supabase]);

    useEffect(() => {
        if (inView) {
            fetchPosts();
        }
    }, [inView, fetchPosts]);

    return (
        <div className="flex flex-col items-center w-full mt-24">
            {posts.map((post) => (
                <div key={post.idPost || post.id} className="flex flex-col items-start w-64 md:w-128 mb-16">
                    <User username={post.tblUsers?.Username} />
                    
                    <SinglePost post={post} />
                </div>
            ))}

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