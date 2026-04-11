import React from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import { ModeToggle } from '@/components/ModeToggle'
import { ChevronLeft, Heart, Bookmark, Timer, Users, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FoodDetailsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const idValue = resolvedParams?.id;
  const postId = typeof idValue === 'string' ? parseInt(idValue) : null;

  if (!postId || isNaN(postId)) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Invalid Post ID</h1>
            <Link href="/" className="mt-4 text-blue-500 hover:underline">Go back home</Link>
        </div>
    )
  }

  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase
    .from('tblPosts')
    .select('*')
    .eq('idPost', postId)
    .single();

  if (error || !post) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <Link href="/" className="mt-4 text-blue-500 hover:underline">Go back home</Link>
        </div>
    )
  }

  const imageUrl = (post as any).txtImageURL;

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4 z-50">
          <Link href="/">
             <ChevronLeft className="w-10 h-10 cursor-pointer hover:opacity-70 transition-opacity drop-shadow-md bg-background/50 rounded-full" />
          </Link>
      </div>

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ModeToggle />
      </div>
      
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col gap-10">
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {imageUrl ? (
                <img src={imageUrl} alt={post.txtTitle || "Recipe Image"} className="w-full md:w-1/2 aspect-square object-cover rounded-3xl" />
            ) : (
                <div className="w-full md:w-1/2 aspect-square bg-muted rounded-3xl flex flex-col gap-4 items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                    <span className="text-muted-foreground font-medium">No image available</span>
                </div>
            )}
            
            <div className="flex flex-col w-full md:w-1/2 gap-6 p-2">
                <h1 className="text-4xl md:text-5xl font-bold break-words">{post.txtTitle}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.txtDescription}</p>
                
                <div className="flex flex-wrap gap-8 mt-4 border-y py-6 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3 text-lg">
                        <Timer className="w-7 h-7 text-orange-500" />
                        <span className="font-semibold">{post.intTime || 0} min</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                        <Users className="w-7 h-7 text-green-500" />
                        <span className="font-semibold">Serves {post.intServings || "--"}</span>
                    </div>
                </div>

                <div className="flex gap-10 mt-auto pt-6">
                    <div className="flex items-center gap-3">
                        {/* Swapped text-white for text-destructive to give it a nice theme-aware red */}
                        <Heart className="w-8 h-8 text-destructive fill-destructive" />
                        <span className="text-2xl font-bold">{post.intLikes || 0}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Swapped text-white for text-primary to give it your theme's main accent color */}
                        <Bookmark className="w-8 h-8 text-primary fill-primary" />
                        <span className="text-2xl font-bold">{post.intBookmarks || 0}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
            <div className="flex-1 flex w-[90vw] md:w-[30vw] h-fit md:h-fit flex-col gap-6">
                <h2 className="text-3xl font-semibold mb-2 pb-2 inline-flex items-center border-b">
                    Ingredients
                </h2>
                <div className="whitespace-pre-wrap text-lg leading-loose bg-muted/40 p-8 rounded-3xl border border-muted">
                    {post.txtIngredients || "No ingredients provided."}
                </div>
            </div>

            <div className="flex w-[90vw] md:w-[40vw] h-fit md:h-[40vw] flex-col gap-6">
                <h2 className="text-3xl font-semibold mb-2 pb-2 inline-flex items-center border-b">
                    Instructions
                </h2>
                <div className="whitespace-pre-wrap text-lg leading-relaxed bg-muted/40 p-8 rounded-3xl border border-muted">
                    {post.txtDirections || "No instructions provided."}
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}