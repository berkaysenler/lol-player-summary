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


  async function searchSummoner(){
    const summonerRes = await fetch(`http://localhost:3001/api/summoner/${gameName}/${tagLine}`);
    const summonerData = await summonerRes.json();
    setSummoner(summonerData);

    const matchesRes = await fetch(`http://localhost:3001/api/matches/${summonerData.puuid}`);
    const matchesData = await matchesRes.json()
    setMatches(matchesData)

    const detailsPromises = matchesData.slice(0,5).map((matchId:string) => fetch (`http://localhost:3001/api/match/${matchId}`).then(res => res.json()))

    const detailsData = await Promise.all(detailsPromises)
    setMatchDetails(detailsData)
    console.log(detailsData)


  }

  return (
    <>
    <h1>Summoner Coaching</h1>
    <div>
    <input type="text" placeholder="Enter your summoner name" value={gameName} onChange={(e) => setGameName(e.target.value)} />
    <input type="text" placeholder="Enter your summoner tag" value={tagLine} onChange={(e) => setTagLine(e.target.value)} />
    </div>

    <button onClick={searchSummoner}>Get Summoner</button>
    {summoner && (
      <div>
        <p>PUUID: {summoner.puuid}</p>
      </div>
    )}
    {matches.length > 0 && (
      <ul>
        {matches.map((matchId) => (
          <li key = {matchId}>{matchId}</li>
        ))}
      </ul>
    )}

    {matchDetails.length > 0 && (
      <div>
        <h2>Match Details</h2>
        {matchDetails.map((match) => {
          const player = match.info.participants.find((p: any) => p.puuid === summoner?.puuid) 
          return (
            <div key={match.metadata.matchId} style={{marginBottom: '10px', padding: '10px', border: '1px solid gray'}}>
              <p>Champion: {player.championName}</p>
              <p>KDA: {player.kills}/{player.deaths}/{player.assists}</p>
              <p>Reuslt: {player.win ? 'Victory' : 'Defeat'} </p>
            </div>
          )
        })}
      </div>
    )}
    </>
    
  );
}
