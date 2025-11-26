'use client'
import { Span } from 'next/dist/trace';
import Image from 'next/image'

interface TeamCompositionProps {
    participants: any[];
    userPuuid: string;
}

export default function TeamComposition({participants, userPuuid}: TeamCompositionProps){

    const blueTeam = participants.filter((p) => p.teamId === 100);
    const redTeam = participants.filter((p) => p.teamId === 200);
 
    const PlayerRow = ({player}: {player: any}) => {
        const isUser = player.puuid === userPuuid;


        return(
            <div className={`flex justify-between items-center py-2 px-3 rounded ${isUser ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-gray-700/30'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-xs">
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/15.23.1/img/champion/${player.championName}.png`}
                        alt={player.championName}
                        className="w-8 h-8 rounded"
                    />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">
                            {player.riotIdGameName || player.summonerName || 'Unknown'}{player.riotIdTagline && `#${player.riotIdTagline}`}
                            {player.pentaKills > 0 && <span className='ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold'>
                                PENTA</span>}
                            {player.quadraKills === 1 && player.pentaKills === 0 && <span className='ml-2 text-xs bg-purple-500  px-2 py-0.5 rounded font-bold'>
                                QUADRA
                                </span>}
                            {player.tripleKills === 1 && player.quadraKills === 0 && player.pentaKills === 0 && <span className='ml-2 text-xs bg-purple-500  px-2 py-0.5 rounded font-bold'>TRIPLE</span>}
                        </p>
                        <p className="text-xs text-gray-400">
                            {player.championName}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                            {[player.item0, player.item1,
                                player.item2, player.item3,
                                player.item4,
                                player.item5].map((itemId, idx) =>
                                    itemId !== 0 ? (
                                <img 
                                    key={idx}
                                    src={`https://ddragon.leagueoflegends.com/cdn/15.23.1/img/item/${itemId}.png`}
                                    alt={`Item ${itemId}`}
                                    className="w-5 h-5 rounded 
                                    border border-gray-600"
                                    
                                />
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">
                        {player.kills}/{player.deaths}/{player.assists}
                    </p>
                    <p className="text-xs text-gray-400">
                        KDA
                    </p>
                    <p className='text-xs text-gray-400'>
                        {player.totalMinionsKilled} CS
                    </p>
                </div>
            </div>
        )

    }

    return(
        <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Blue Team */}
            <div>
                <h3 className="text-sm font-bold text-blue-400 mb-2">Blue Team</h3>
                <div className="space-y-1">
                    {blueTeam.map((player) => (
                        <PlayerRow key = {player.puuid} player={player}/>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-red-400 mb-2">
                    Red Team
                </h3>
                <div className="space-y-1">
                    {redTeam.map((player) => (
                        <PlayerRow key={player.puuid} player={player}/>
                    ))}
                </div>
            </div>
        </div>
    )


}