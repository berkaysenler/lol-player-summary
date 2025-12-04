'use client'

interface SummonerProfileProps {
    summoner: {
        gameName: string;
        tagLine: string;
        puuid: string;
    };
    summonerDetails: any;
    rankedInfo: any[];
    user: any;
    isFavorited: boolean;
    onToggleFavorite: () => void;
}

export default function SummonerProfile({summoner, user, isFavorited, rankedInfo, summonerDetails, onToggleFavorite}: SummonerProfileProps){

    function getRankIcon(tier: string){
        if (!tier) return null;
        return `https://opgg-static.akamaized.net/images/medals_new/${tier.toLowerCase()}.png`;
    }


         // Get solo queue rank
        const soloRank = rankedInfo?.find((entry: any) => entry.queueType === 'RANKED_SOLO_5x5');
  
        // Calculate winrate
        const winrate = soloRank ? Math.round((soloRank.wins / (soloRank.wins + soloRank.losses)) * 100) : 0;


        return(
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-6">
                    {/* Profile Icon */}
                    {summonerDetails?.profileIconId ? (
                        <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/15.23.1/img/profileicon/${summonerDetails.profileIconId}.png`}
                            alt="Profile Icon"
                            className="w-24 h-24 rounded-xl border-4  border-purple-500"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-xl bg-gray-700" />
                    )}
  
                    {/* Summoner Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold  text-yellow-500">
                                {summoner.gameName}
                            </h2>
                            <span className="text-xl text-gray-400">
                                #{summoner.tagLine}</span>
  
                            {user && (
                                <button onClick={onToggleFavorite}
                                className={`px-4 py-2 rounded font-semibold transition-colors ${isFavorited ? 'bg-yellow-600  hover:bg-yellow-700' : 'bg-gray-700  hover:bg-gray-600'}`}
                                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
                                     {isFavorited ? '★' : '☆'}
                                </button>
                            )}
                        </div>
  
                        <div className="flex items-center gap-4 text-sm  text-gray-300">
                            <span>
                                Level {summonerDetails?.summonerLevel ||'?'}
                            </span>
                            <span>•</span>
                            <span>OCE</span>
                        </div>
                    </div>
  
                    {/* Ranked Info */}
                    {soloRank && (
                        <div className="flex items-center gap-4 bg-gray-800  rounded-lg p-4">
                             {getRankIcon(soloRank.tier) && (
                                <img 
                                    src={getRankIcon(soloRank.tier)!}
                                    alt={soloRank.tier}
                                    className="w-20 h-20"
                                    onError={(e) => {e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <div>
                                <p className="text-xs text-gray-400   mb-1">
                                    Ranked Solo/Duo
                                </p>
                                <p  className="text-xl font-bold  text-yellow-500">
                                     {soloRank.tier} {soloRank.rank}
                                </p>
                                <p className="text-sm text-gray-300">
                                     {soloRank.leaguePoints} LP
                                </p>
                                <p  className="text-xs text-gray-400 mt-1">
                                     {soloRank.wins}W {soloRank.losses}L ({winrate}%)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
}