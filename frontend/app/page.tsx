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
