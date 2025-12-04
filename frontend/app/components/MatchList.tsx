'use client'

import MatchCard from './MatchCard'

interface MatchListProps {
    matchDetails: any[];
    summoner: any;
    expandedMatch: string | null;
    setExpandedMatch: (matchId: string | null) => void;
    coaching: {[key: string]: string};
    loadingCoaching: string | null;
    getCoaching: (matchId: string, playerStats: any) => void;
    totalMatches: number;
    onLoadMore: () => void;
    loading: boolean;
}

export default function MatchList({matchDetails, summoner, expandedMatch, setExpandedMatch, coaching, loadingCoaching, getCoaching, totalMatches, onLoadMore, loading}: MatchListProps){

    if(matchDetails.length === 0){
        return null;
    }

    return (
        <div>
            <h2 className='text-2xl font-bold text-center mb-6'>    
                <div className='flex flex-col gap-4 max-w-2xl mx-auto'>
                    {matchDetails.map((match) => (
                        <MatchCard
                        key={match.metadata.matchId}
                        match={match}
                        summoner={summoner}
                        expandedMatch={expandedMatch}
                        setExpandedMatch={setExpandedMatch}
                        coaching={coaching}
                        loadingCoaching={loadingCoaching}
                        getCoaching={getCoaching}/>

                    ))}
                    
                </div>

                {/* Load More Button*/}
                      {matchDetails.length < totalMatches && (
                          <div className="flex justify-center mt-4">
                              <button
                                  onClick={onLoadMore}
                                  disabled={loading}
                                  className="px-6 py-3 bg-purple-600  hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg  font-semibold transition-colors"
                              >
                                  {loading ? 'Loading...' : `Load More (${matchDetails.length}/${totalMatches})`}
                              </button>
                          </div>
                      )}
            </h2>
        </div>
    )
}