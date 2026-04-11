import React from 'react'

const User = ({ username }: { username: string }) => {
  return (
    <div className='flex w-2xs gap-4'>
        <img className='rounded-full' src="favicon.ico" alt="" />
        <div>
            <h1 className='font-semibold'>{username || "Unnamed Taster"}</h1>
        </div>
        
    </div>

  )
}

export default User