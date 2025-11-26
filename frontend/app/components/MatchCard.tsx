'use client'
import TeamComposition from "./TeamComposition";
import ObjectivesDisplay from "./ObjectivesDisplay";

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
        className={`relative p-4 rounded-lg 
            border-l-4 cursor-pointer 
            transition-all overflow-hidden ${isWin 
            ? 'border-green-500' : 
            'border-red-500'}`} 
        onClick={() => setExpandedMatch(isExpanded ? null : match.metadata.matchId)}>

            {/* Background splahs art */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${player.championName}_0.jpg)`}}
            />

            {/* Dark overlay */}
            <div 
                className={`absolute inset-0 
                ${isWin ? 'bg-green-900/50' : 
                'bg-red-900/50'}`} 
            />

            <div className='relative z-10 flex justify-between items-center'>
                  <div>

                    <p className='text-lg font-bold'>Champion: {player.championName}</p>
                    <p className='text-gray-400'>{isWin ? 'Victory' : 'Defeat' } </p>

                    {!isExpanded && (
                        <div className="flex gap-0.5 mt-2">
                            {[player.item0, player.item1,
                            player.item2, player.item3,
                            player.item4,
                            player.item5].map((itemId, idx) => itemId !== 0 ? (
                        <img 
                        key={idx}
                        src={`https://ddragon.leagueoflegends.com/cdn/15.23.1/img/item/${itemId}.png`}
                        alt={`Item ${itemId}`}
                        className="w-6 h-6 
                        rounded border border-gray-600"
                        />
                        ) : null
                        )}
                        </div>
                    )}
                  </div>
                  <div className='text-right'>

                    <p className='text-2xl font-bold'>{player.kills}/{player.deaths}/{player.assists}</p>
                    <p className='text-gray-400'>KDA</p>
                  </div>
                </div>
                {isExpanded && (
                  <div className='relative z-10 mt-4 pt-4 border-t border-gray-600'>
                    <div className='mt-4 mb-6'>
                        {!coaching[match.metadata.matchId] ? (
                            <div className="flex justify-center">

                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    getCoaching(match.metadata.matchId, {player, match});
                                    }} disabled={loadingCoaching === match.metadata.matchId}
                                    className='bg-purple-950 
                                    hover:bg-purple-900 px-3 py-1.5 rounded
                                    text-sm font-semibold 
                                    disabled:opacity-50 flex items-center 
                                    justify-center gap-2 group relative'
                                    title="Ask AI about this match"> 
                                    <span className="text-xl">✨</span>
                                    <span>
                                        {loadingCoaching === match.metadata.matchId ? 'Analysing...' : 'AI Analysis'}
                                    </span>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Ask AI about this match
                                    </span>
                                </button>
                            </div>
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
                        <ObjectivesDisplay teams={match.info.teams}/>
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