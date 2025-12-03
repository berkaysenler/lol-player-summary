'use client'

import {useState} from 'react'
import {supabase} from '@/lib/supabase'
import {useRouter} from 'next/navigation'

export default function AuthPage(){
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const [confirmPassword, setConfirmPassword] = useState('')
    

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault(); // To prevent page reload
        setLoading(true); // Show Loading state
        setError('') //Clear previous errors

        try{
            if (isLogin){
                //LOGIN
                const {data, error} = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if(error) throw error;

                console.log('Logged in:', data)
                router.push('/'); // Redirect to home page

            } else {
                // REGISTER
                if (password !== confirmPassword) {
                    setError('Passwords do not match!');
                    setLoading(false);
                    return;
                }
                const {data, error} = await supabase.auth.signUp({
                    email,
                    password,
                })
                
                if(error) throw error;
                console.log('Registered:', data)
                alert('Check your email to confirm your account!')
            }
        } catch (err: any){
            console.error('Full error:', err)
            setError(err.message) //Show error to user

        } finally {
            setLoading(false) // Stop loading state
        }
    }

    return (
        <main className='min-h-screen bg-gray-800 text-white flex items-center justify-center p-8'>

            <div className='bg-gray-900 p-8 rounded-lg w-full max-w-md'>
                <h1 className='text-3xl font-bold text-center mn-6'>
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Email Input */}
                    <div>
                        <label className='block text-sm font-semibold'>
                            Email
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required
                        className='w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500' />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label className='block text-sm font-semibold'>
                            Password
                        </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className='w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-non focus:border-purple-500' />
                        {!isLogin && (
                            <div>
                                <label className='block text-sm font-semibold mb-2'>Confirm Password
                                </label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className='w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:border-purpler-500' />
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className='bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded text-sm'>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type='submit' disabled={loading} className='w-full bg-purple-600 hover:bg=purple-700 px-6 py=3 rounded font-semihold disabled:opacity-50'>
                        {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {/* Toggle Login/Register */}
                <div className='mt-4 text-center'>
                    <button onClick={() => setIsLogin(!isLogin)}
                        className='text-purple-400 hover:text-purple-300 text-sm'>
                            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'} 
                    </button>
                </div>
            </div>
        </main>
    )
}