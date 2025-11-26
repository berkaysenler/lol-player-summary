'use client'

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
                        {/* Champions icons */}
                        {player.championName.substring(0, 2)}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">
                            {player.riotIdGameName || player.summonerName || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400">
                            {player.championName}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">
                        {player.kills}/{player.deaths}/{player.assists}
                    </p>
                    <p className="text-xs text-gray-400">
                        KDA
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