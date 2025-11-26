'use client'
import TeamComposition from "./TeamComposition";

interface MatchCardProps {
    match: any;
    summoner: any;
    expandedMatch: string | null;
    setExpandedMatch: (matchId: string| null) => void;
    coaching: {[key:string]: string};
    loadingCoaching: string | null;
    getCoaching: (matchId: string, playerStats: any) => void;
}

export default function MatchCard({
    match,
    summoner,
    expandedMatch,
    setExpandedMatch,
    coaching,
    loadingCoaching,
    getCoaching

}: MatchCardProps){

    const player = match.info.participants.find((p: any) => p.puuid === summoner?.puuid);
    const isWin = player.win;
    const isExpanded = expandedMatch === match.metadata.matchId;

    return(
        <div key={match.metadata.matchId}
        className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${isWin ? 'bg-green-400/30 border-green-500' : 'bg-red-900/30 border-red-500'}`} 
        onClick={() => setExpandedMatch(isExpanded ? null : match.metadata.matchId)}>

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
                        <TeamComposition participants={match.info.participants} 
                        userPuuid={summoner.puuid}/>
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

}