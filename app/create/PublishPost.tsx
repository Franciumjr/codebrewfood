"use client"

import React, { useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { Images, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

type PublishPostProps = {
  user: User | null;
}

export default function PublishPost({ user }: PublishPostProps) {
    // Image handling states
    const [previewURL, setPreviewURL] = useState('');
    const fileinRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);

    // Post detail states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    // Storing as strings locally prevents 'NaN' quirks when users clear the textarea
    const [servingSize, setServingSize] = useState(""); 
    const [time, setTime] = useState("");

    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = getSupabaseBrowserClient();

    async function handlePublish(e: React.FormEvent) {
        e.preventDefault(); // Prevents the page from refreshing on submit
        setIsSubmitting(true);
        setStatus("Publishing...");

        if (!user) {
            setStatus("You must be logged in to publish a post.");
            setIsSubmitting(false);
            return;
        }

        let uploadedImageURL = "";

        // 1. Only upload the image when the user clicks "Publish"
        if (file) {
            try {
                setStatus("Uploading image...");
                uploadedImageURL = await uploadImageToCloudinary(file);
            } catch (err) {
                console.error(err);
                setStatus("Image upload failed.");
                setIsSubmitting(false);
                return;
            }
        } else {
            setStatus("Please select an image before publishing.");
            setIsSubmitting(false);
            return;
        }

        // 2. Save the final post to Supabase
        const { error } = await supabase.from("tblPosts")
            .insert({ 
                txtTitle: title,
                txtDescription: description,
                txtIngredients: ingredients,
                txtDirections: instructions,
                intServings: parseInt(servingSize) || 0,
                txtImageURL: uploadedImageURL,
                intTime: parseInt(time) || 0,
                idUser: user.id
            } as any);

        if (error) {
            setStatus("Error publishing post.");
            console.error(error);
        } else {
            setStatus("Post published successfully!");
            // Optional: You can clear the form states here or redirect the user
        }
        
        setIsSubmitting(false);
    }

    const uploadImageToCloudinary = async (file: File) => { 
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_uploads");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!res.ok) throw new Error("Cloudinary upload failed");
        
        const data = await res.json();
        return data.secure_url;
    }

    // Handles generating a temporary local URL so the user can preview what they selected
    const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setPreviewURL(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    }

    return (
        <form onSubmit={handlePublish}>
            <Link href="/"><ChevronLeft /></Link>
            <div className='flex gap-6 flex-col justify-center items-center mb-24'>

                <div className='flex gap-4 justify-center '>
                    <input 
                        className='hidden' 
                        type="file" 
                        accept="image/*"
                        ref={fileinRef} 
                        onChange={handleImageSelection} 
                    />
                    {!previewURL ? (
                        <div className="mt-24 cursor-pointer text-zinc-500 size-64 border-2 border-dashed rounded-lg flex items-center justify-center gap-2"
                            onClick={() => fileinRef.current?.click()}>
                            <Images />
                            <Button type="button" variant="ghost">Upload Image</Button>
                        </div>
                    ) : (
                        <div className="mt-24 cursor-pointer text-zinc-500 size-64 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden"
                            onClick={() => fileinRef.current?.click()}>
                            <img src={previewURL} alt="Preview" className="w-full h-full object-cover" />
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
                    <Textarea required minLength={1} className='w-[34vw] md:w-[24vw]' placeholder='Serving Size' 
                        value={servingSize}
                        onChange={(e) => setServingSize(e.target.value)}
                    />
                    <Textarea required minLength={1} className='w-[34vw] md:w-[24vw]' placeholder='Time (mins)' 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                
                {/* Button automatically acts as a submit trigger for the form */}
                <Button disabled={isSubmitting} size="lg" type="submit">
                    {isSubmitting ? "Publishing..." : "Publish"}
                </Button>
                
                {status && (<p className="font-medium text-center">{status}</p>)}
                
                <div className="fixed top-4 right-4 z-50 md:z-auto flex gap-2 md:m-4 lg:p-0">
                    <ModeToggle />
                </div>
            </div>
        </form>
    )
}