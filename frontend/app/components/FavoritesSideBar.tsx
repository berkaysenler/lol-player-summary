'use client';

  import { getRankIcon, getRankForQueue } from '@/utils/riot'

  interface FavoritesSidebarProps {favorites: any[];
    onSelectSummoner: (gameName: string, tagLine: string, region: string) => void;
    onRemoveFavorite: (puuid: string) => void;
  }

  export default function FavoritesSidebar({ 
    favorites, 
    onSelectSummoner,
    onRemoveFavorite 
  }: FavoritesSidebarProps) {


   

    if (favorites.length === 0) {
      return (
        <div className="bg-[#48354c] p-4 rounded-lg" style={{boxShadow: 'rgba(0, 0, 0, .24) 0px 2px 8px 0px'}}>
          <h2 className="text-xl font-bold mb-4 text-purple-400">Favorites</h2>
            <p className="text-gray-500 text-sm">
                No favorites yet. Search for asummoner and click the ★ button!
            </p>
        </div>
      );
    }

    return (
      <div className="bg-[#48354c] p-4 rounded-lg " style={{boxShadow: 'rgba(0, 0, 0, .24) 0px 2px 8px 0px'}}>
        <h2 className="text-xl font-bold mb-4 text-[#f8c48d]">Favorites</h2>
            <div className="space-y-3">
                {favorites.map((fav, index) => {
                    const soloRank = getRankForQueue(fav.rankedData, 'RANKED_SOLO_5x5');
                    const flexRank = getRankForQueue(fav.rankedData, 'RANKED_FLEX_SR');

            return (
              <div
                key={fav.puuid || `favorite-${index}`}
                className="bg-[#5a4965] p-3 rounded-lg hover:bg-[#322334] transition-colors cursor-pointer group relative"
                onClick={() => onSelectSummoner(fav.game_name, fav.tag_line, 'OCE')}
                style={{boxShadow: '0 4px 6px -4px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'}}
              >
                {/* Remove button - top right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(fav.puuid);
                  }}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 text-xl leading-none"
                  title="Remove from favorites"
                >
                  ×
                </button>

                {/* Top section: Icon + Name + Level */}
                <div className="flex items-center gap-3 mb-2">
                  {fav.profileIconId ? (
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/15.23.1/img/profileicon/${fav.profileIconId}.png`}
                      alt="Profile Icon"
                      className="w-12 h-12 rounded-xl border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                        {fav.game_name}
                    </p>
                    <p className="text-xs  text-gray-400">#{fav.tag_line}
                    </p>
                        {fav.summonerLevel && (
                      <p className="text-xs  text-purple-300">
                        Level {fav.summonerLevel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ranks section
                <div className="space-y-1">
                  {soloRank && (
                    <div className="flex items-center gap-2 text-xs">
                        {getRankIcon(soloRank.tier) && (
                            <img
                            src={getRankIcon(soloRank.tier)!}
                            alt={soloRank.tier}
                            className="w-24 h-24"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            />  
                      )}
                      <span className="text-blue-400 font-semibold">
                        Ranked Solo/Duo:
                      </span>
                      <span className="text-gray-300">
                        {soloRank.tier} {soloRank.rank}
                      </span>
                    </div>
                  )}

                  {flexRank && (
                    <div className="flex items-center gap-2 text-xs">
                        {getRankIcon(flexRank.tier) && (
                        <img
                          src={getRankIcon(flexRank.tier)!}
                          alt={flexRank.tier}
                          className="w-15 h-15"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="text-green-400 font-semibold">
                        Ranked Flex:
                      </span>
                      <span className="text-gray-300">
                        {flexRank.tier} {flexRank.rank}
                      </span>
                    </div>
                  )}

                  {!soloRank && !flexRank && fav.rankedData && (
                    <p className="text-xs  text-gray-500">
                        Unranked
                    </p>
                  )}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    );
  }