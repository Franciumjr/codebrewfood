import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const User = () => {
  return (
    <div className='flex w-2xs'>
        
        <Card size='sm' className='border-0 w-6xl'>
            <div>
                <img className='w-md rounded-full' src="https://picsum.photos/id/237/50/50" alt="" />
            </div>

            <CardHeader className='font-semibold'>Diddy Sahur</CardHeader>
            <CardDescription>@diddysahur</CardDescription>
        </Card>
    </div>

  )
}

export default User