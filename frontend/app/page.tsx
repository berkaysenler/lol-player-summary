'use client';
import { useState } from 'react';




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
    <main className='min-h-screen bg-rose-950 text-white p-8'>

      <h1 className='text-4xl font-bold text-center mb-8'>Coaching</h1>
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

          {matchDetails.map((match) => {
            const player = match.info.participants.find((p: any) => p.puuid === summoner?.puuid);
            const isWin = player.win;
            const isExpanded = expandedMatch === match.metadata.matchId;
            return (
              <div key={match.metadata.matchId} className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${isWin ? 'bg-green-400/30 border-green-500' : 'bg-red-900/30 border-red-500'}`} onClick={() => setExpandedMatch(isExpanded ? null : match.metadata.matchId)}>

                <div className='flex justify-between items-center'>
                  <div>

                    <p className='text-lg font-bold'>Champion: {player.championName}</p>
                    <p className='text-gray-400'>{isWin ? 'Victory' : 'Defeat' } </p>

                  </div>
                  <div className='text-right'>

                    <p className='text-2xl font-bold'>{player.kills}/{player.deaths}/{player.assists}</p>
                    <p className='text-gray-400'>KDA</p>
                  </div>
                </div>
                {isExpanded && (
                  <div className='mt-4 pt-4 border-t border-gray-600'>
                    <div className='mt-4 mb-6'>
                        {!coaching[match.metadata.matchId] ? (
                          <button onClick={(e) => {
                            e.stopPropagation();
                            getCoaching(match.metadata.matchId, player);
                          }} disabled={loadingCoaching === match.metadata.matchId}
                          className='w-full bg-purple-950 hover:bg-purple-900 px-4 py-2 rounded font-semibold disabled:opacity-50'> {loadingCoaching === match.metadata.matchId ? 'Analysing...' : 'Get AI Coaching'}
                          </button>
                        ): (
                          <div className='bg-gray-800/50 p-4 rounded'>
                            <p className='text-sm font-bold text-blue-400 mb-3'>
                              KaissuBot:
                            </p>
                            <div className='space-y-2'>
                              {coaching[match.metadata.matchId].split('\n').filter((line: string) => line.trim()).map((tip: string, i: number) => (
                                <div key={i} className='flex gap-3'>
                                  <span className='text-blue-400 font-bold'>
                                    {i + 1}.
                                  </span>
                                  <p className='text-sm text-gray-200'>
                                    {tip.replace(/^\d+\.\s*/,'')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                        )}
                      </div>
                    <div className='grid grid-cols-2 gap-4'>
                      
                      <div>

                        <p className='text-gray-400'>
                          CS
                        </p>
                        <p className='font-bold'>
                          {player.totalMinionsKilled + player.neutralMinionsKilled}
                        </p>
                      </div>
                      <div>
                          <p className='text-gray-400'>Gold Earned</p>
                          <p className='font-bold'>
                            {player.goldEarned.toLocaleString()}
                          </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>
                          Damage Dealt
                        </p>
                        <p className='font-bold'>
                          {player.totalDamageDealtToChampions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>
                          Vision Score
                        </p>
                        <p className='font-bold'>
                          {player.visionScore}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        </div>
      )}

    </main>
    
  );
}
