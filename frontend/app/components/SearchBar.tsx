'use client'
import {useState} from 'react'


interface SearchBarProps {
    onSearch: (gameName: string, tagLine: string, region: string) => void;
    loading: boolean;
    onClearError?: () => void;
}

const REGIONS = [
    { value: 'OCE', label: 'Oceania' },
    { value: 'NA', label: 'North America' },
    { value: 'EUW', label: 'Europe West' },
    { value: 'EUNE', label: 'Europe Nordic & East' },
    { value: 'KR', label: 'Korea' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'LAN', label: 'Latin America North' },
    { value: 'LAS', label: 'Latin America South' },
    { value: 'TR', label: 'Turkey' },
    { value: 'RU', label: 'Russia' },
];

export default function SearchBar({ onSearch, loading, onClearError}: SearchBarProps){
    const [gameName, setGameName] = useState('')
    const [tagLine, setTagLine] = useState('')
    const [region, setRegion] = useState('OCE')
    const [validationError, setValidationError] = useState('')

    function handleInputChange(setter: (value: string) => void, value: string) {
        setter(value);
        onClearError?.(); // Clear parent error when user starts typing
    }

    function handleSubmit() {
        setValidationError('')

        const trimmedGameName = gameName.trim()
        const trimmedTagLine = tagLine.trim()

        if(!trimmedGameName || !trimmedTagLine) {
            setValidationError('Please enter both summoner name and tag')
            return
        }

        onSearch(trimmedGameName, trimmedTagLine, region)
    }

    return(
        <div>
            <div className='flex flex-col md:flex-row gap-4 justify-center mb-4'>
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className='w-full md:w-auto px-4 py-2 rounded bg-[#8f7790] border border-gray-700 focus:outline-none focus:border-yellow-700 text-white'
                >
                    {REGIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder='Summoner Name'
                    value={gameName}
                    onChange={(e) => handleInputChange(setGameName, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className='w-full md:w-auto px-4 py-2 rounded bg-[#8f7790] border border-gray-700 focus:outline-none focus:border-yellow-700'
                />
                <input
                    type="text"
                    placeholder='Riot Tag'
                    value={tagLine}
                    onChange={(e) => handleInputChange(setTagLine, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className='w-full md:w-auto px-4 py-2 rounded bg-[#8f7790] border border-gray-700 focus:outline-none focus:border-yellow-700'
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
                    className='px-6 py-2 bg-[#555147] rounded font-semibold hover:bg-[#403129] disabled:opacity-70 transition-colors'
                >
                    {loading ? 'Loading...' : 'Search'}
                </button>
            </div>
        </div>
    )
}
