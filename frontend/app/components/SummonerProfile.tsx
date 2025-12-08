'use client'

import { getRankIcon, calculateWinrate } from '@/utils/riot'

interface SummonerProfileProps {
    summoner: {
        gameName: string;
        tagLine: string;
        puuid: string;
    };
    summonerDetails: any;
    rankedInfo: any[];
    region: string;
    user: any;
    isFavorited: boolean;
    onToggleFavorite: () => void;
}

export default function SummonerProfile({summoner, user, isFavorited, rankedInfo, summonerDetails, region, onToggleFavorite}: SummonerProfileProps){

    


         // Get solo queue rank
        const soloRank = rankedInfo?.find((entry: any) => entry.queueType === 'RANKED_SOLO_5x5');
  
        // Calculate winrate
        const winrate = soloRank ? calculateWinrate(soloRank.wins, soloRank.losses) : 0

        return(
            <div className="bg-[#5a4965] rounded-lg p-6 mb-8 " style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 2px 8px 0px'}}>
                <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
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
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h2 className="text-xl md:text-3xl font-bold  text-yellow-500">
                                {summoner.gameName}
                            </h2>
                            <span className="text-lg md:text-xl text-gray-400">
                                #{summoner.tagLine}</span>
  
                            {user && (
                                <button onClick={onToggleFavorite}
                                className={`px-4 py-2 rounded font-semibold transition-colors ${isFavorited ? 'bg-[#daba08]  hover:bg-[#f4ee7b]' : 'bg-[#555147]  hover:bg-[#3c3623]'}`}
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
                            <span>{region}</span>
                        </div>
                    </div>
  
                    {/* Ranked Info */}
                    {soloRank && (
                        <div className="flex  items-center gap-4 bg-[#48354c]  rounded-lg p-4 " style={{boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.6)'}}>
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