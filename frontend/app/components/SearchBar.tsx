'use client'
import {useState} from 'react'

interface SearchBarProps {
    onSearch: (gameName: string, tagLine: string) => void;
    loading: boolean;
}

export default function SearchBar({ onSearch, loading}: SearchBarProps){
    const [gameName, setGameName] = useState('')
    const [tagLine, setTagLine] = useState('')
    const [validationError, setValidationError] = useState('')

    function handleSubmit() {
        setValidationError('')

        const trimmedGameName = gameName.trim()
        const trimmedTagLine = tagLine.trim()

        if(!trimmedGameName || !trimmedTagLine) {
            setValidationError('Please enter both summoner name and tag')
            return
        }

        onSearch(trimmedGameName, trimmedTagLine)
    }
    
    return(
        <div>
            <div className='flex gap-4 justify-center mb-4'>
                <input
                    type="text"
                    placeholder='Summoner Name'
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className='px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-700'
                />
                <input
                    type="text"
                    placeholder='Riot Tag'
                    value={tagLine}
                    onChange={(e) => setTagLine(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className='px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-700'
                />
            </div>

            {validationError && (
                <div className='text-red-400 text-center mb-4 text-sm'>
                    {validationError}
                </div>
            )}

            <div className='flex justify-center mb-8'>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !gameName || !tagLine}
                    className='px-6 py-2 bg-purple-950 rounded font-semibold hover:bg-purple-900 disabled:opacity-50 transition-colors'
                >
                    {loading ? 'Loading...' : 'Get Summoner'}
                </button>
            </div>
        </div>
    )
}