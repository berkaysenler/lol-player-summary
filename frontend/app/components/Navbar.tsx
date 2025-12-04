'use client'
import {supabase} from '@/lib/supabase'

interface NavbarProps {
    user: any;
    onLogout: () => void;
}

export default function Navbar({user, onLogout}: NavbarProps){
    return(
        <div className=' sticky top-0 z-50 bg-gray-800 py-4 flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold'>Kai.gg</h1>
          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-400'>Welcome, {user.email}</span>
                <button onClick={onLogout} className='px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semobold'>
                  Logout
                </button>
            </div>
          ) : (
            <a href="/auth" className='px-4 py-2 bg-purple-600 hover:bg-ourple-700 rounded font-semibold'>
              Login
              </a>
          )}
      </div>
    )
}