'use client'
import {supabase} from '@/lib/supabase'

interface NavbarProps {
    user: any;
    onLogout: () => void;
}

export default function Navbar({user, onLogout}: NavbarProps){
    return(
          <div className=' sticky top-0 z-50 bg-[#2d2236] py-4 flex justify-between items-center mb-8  p-8' style={{boxShadow: 'rgba(0, 0, 0, 0.44) 0px 2px 8px 0px'}}>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#beacc9]'>Kai.gg</h1>
          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-400'>Welcome, {user.email}</span>
                <button onClick={onLogout} className='px-4 py-2 bg-[#555147] hover:bg-[#403129] rounded-2xl font-semobold'>
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