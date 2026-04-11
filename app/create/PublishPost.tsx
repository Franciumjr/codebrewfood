"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Images, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

type PublishPostProps = {
  user: User | null;
}

export default function EmailLogin({ user }: PublishPostProps) {
    const [imageURL, setimageURL] = useState('');
    const fileinRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);

    // Post details
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [servingSize, setServingSize] = useState(0);
    const [time, setTime] = useState(0);

    const [status, setStatus] = useState("")
    const supabase = getSupabaseBrowserClient()

    async function publishPost() {
        setStatus("Publishing...")

        if (!user) {
            setStatus("You must be logged in to publish a post.")
            return
        }

        const { error } = await supabase.from("tblPosts")
            .insert({ 
                txtTitle: title,
                txtDescription: description,
                txtIngredients: ingredients,
                txtDirections: instructions,
                intServings: servingSize,
                intTime: time,
                idUser: user.id
            })

        if (error) {
            setStatus("Error publishing post.")
            console.error(error)
        } else {
            setStatus("Post published successfully.")
        }

        return
    }

    useEffect(() => {
        if (file) {
            const data = new FormData;
            data.set('file', file);
            fetch("/api/upload", {
                method: "POST",
                body: data,
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Upload API not ready");
                    return res.json();
                })
                .then((data) => {
                    if (data.url) setimageURL(data.url);
                })
                .catch((err) => console.log(err));
        }
    }, [file])

    return (
        <>
            <form>
                <Link href="/"><ChevronLeft></ChevronLeft></Link>
                <div className='flex gap-6 flex-col justify-center items-center mb-24'>

                    <div className='flex gap-4 justify-center '>
                        <input className='hidden' type="file" ref={fileinRef} onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setimageURL(URL.createObjectURL(e.target.files[0]));
                                setFile(e.target.files[0]);
                            }
                        }} />
                        {!imageURL ? (
                            <div className="mt-24 cursor-pointer text-zinc-500 size-64 border-2 border-dashed rounded-lg flex items-center justify-center gap-2"
                                onClick={() => fileinRef.current?.click()}>
                                <Images></Images>
                                <Button variant="ghost">Upload Image</Button>
                            </div>
                        ) : (
                            <div className="mt-24 cursor-pointer text-zinc-500 size-64 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden"
                                onClick={() => fileinRef.current?.click()}>
                                <img src={imageURL} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <Textarea required minLength={1} className='mt-24 w-[50vw]' placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <Textarea required minLength={1} className='w-[70vw] md:w-[50vw]' placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    <Textarea required minLength={1} className='w-[70vw] md:w-[50vw]' placeholder="Ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)} />
                    <Textarea required minLength={1} className='w-[70vw] md:w-[50vw]' placeholder="Instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)} />
                    <div className='flex justify-between gap-4'>
                        <Textarea required minLength={1} className='w-[34vw] md:w-[24vw]' id='' placeholder='Serving Size' 
                            value={servingSize.toString()}
                            onChange={(e) => setServingSize(parseInt(e.target.value) || 0)}
                        />
                        <Textarea required minLength={1} className='w-[34vw] md:w-[24vw]' placeholder='Time' 
                            value={time.toString()}
                            onChange={(e) => setTime(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <Button onClick={publishPost} size="lg" className='' type="submit">Publish</Button>
                    {status && (<p>{status}</p>)}
                    <div className="fixed top-4 right-4 z-50 md:z-auto flex gap-2 md:m-4 lg:p-0">
                        <ModeToggle></ModeToggle> {/**light / dark mode */}
                    </div>
                </div>
            </form>
        </>
    )
}