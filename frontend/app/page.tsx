'use client';
import { useState } from 'react';
import MatchCard from './components/MatchCard';



export default function Home() {

  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  interface Summoner{
    puuid: string;
    gameName: string;
    tagLine: string;
  }

  const [summoner, setSummoner] = useState<Summoner | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [matchDetails, setMatchDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [coaching, setCoaching] = useState<{[key: string]: string}>({})
  const [loadingCoaching, setLoadingCoaching] = useState<string | null>(null)


  async function getCoaching(matchId: string, playerStats: any){
    setLoadingCoaching(matchId);

    const response = await fetch('http://localhost:3001/api/coaching', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(playerStats)
    })

    const data = await response.json();
    setCoaching(prev => ({...prev, [matchId]: data.coaching }))
    setLoadingCoaching(null)
  }




  async function searchSummoner(){
    setLoading(true)

    const summonerRes = await fetch(`http://localhost:3001/api/summoner/${gameName}/${tagLine}`);
    const summonerData = await summonerRes.json();
    setSummoner(summonerData);

    const matchesRes = await fetch(`http://localhost:3001/api/matches/${summonerData.puuid}`);
    const matchesData = await matchesRes.json()
    setMatches(matchesData)

    const detailsPromises = matchesData.slice(0,5).map((matchId:string) => fetch (`http://localhost:3001/api/match/${matchId}`).then(res => res.json()))

    const detailsData = await Promise.all(detailsPromises)
    setMatchDetails(detailsData)

    setLoading(false)

  
  }

  return (
    <main className='min-h-screen bg-gray-800 text-white p-8'>

      <h1 className='text-4xl font-bold text-center mb-8'>Kai.gg</h1>
      <div className='flex gap-4 justify-center mb-8'>
        <input type="text" placeholder="Summoner Name" value={gameName} onChange={(e) => setGameName(e.target.value)} className='px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-700' />

        <input type="text" placeholder="Riot Tag" value={tagLine} onChange={(e) => setTagLine(e.target.value)} className='px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-700'/>
      </div>
      <div className='flex justify-center mb-8'>
        <button onClick={searchSummoner} disabled={loading} className='px-6 py-2 bg-purple-950 rounded font-semibold hover:bg-purple-900 disabled:opacity-50 '> {loading? 'Loading...' : 'Get Summoner'}</button>
      </div>
      {summoner && (
        <div className='text-center mb-8'>
          <p className='text-xl'>Welcome, 
            <span className='font-bold text-yellow-500'> {summoner.gameName}#{summoner.tagLine}</span>
          </p>
        </div>
      )}  

      {matchDetails.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-center mb-6'>Recent Matches</h2>
          <div className='flex flex-col gap-4 max-w-2xl mx-auto'>

            {matchDetails.map((match) => (
              <MatchCard

                key={match.metadata.matchId}
                match={match}
                summoner={summoner}
                expandedMatch = {expandedMatch}
                setExpandedMatch={setExpandedMatch}
                coaching = {coaching}
                loadingCoaching ={loadingCoaching}
                getCoaching={getCoaching}
               />
            ))}
          
          </div>
        </div>
      )}

    </main>
    
  );
}
