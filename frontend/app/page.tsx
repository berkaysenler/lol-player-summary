'use client';
import { useState, useEffect } from 'react';
import MatchCard from './components/MatchCard';
import {supabase} from '@/lib/supabase'
import Navbar from './components/Navbar';
import SummonerProfile from './components/SummonerProfile';
import MatchList from './components/MatchList';
import SearchBar from './components/SearchBar';
import FavoritesSidebar from './components/FavoritesSideBar';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useSummonerSearch } from '@/hooks/useSummonerSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useCoaching } from '@/hooks/useCoaching';


export default function Home() {

  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const {user, logout} = useAuth();
  const{
    summoner,
    summonerDetails,
    rankedInfo,
    matches,
    matchDetails,
    loading,
    error,
    currentRegion,
    searchSummoner,
    loadMoreMatches,
    clearError,
  } = useSummonerSearch();

  const { favorites, toggleFavorite, removeFavorite} = useFavorites(user);
  const {coaching, loadingCoaching, getCoaching} = useCoaching();
  const isFavorited = favorites.some((fav: any) => fav.puuid === summoner?.puuid);




  return (
    <>
    <div className='min-h-screen bg-[#41324d] text-white '>

    <Navbar user={user}
        onLogout={logout}/>

    <main className='p-4 md:p-6 lg:p-8'>
      

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* left sidebar - only if user is logged in */}
          {user && (
            <div className='hidden lg:block w-90 flex-shrink-0'>
              <div className='sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto p-2 pr-4'>
            <FavoritesSidebar favorites={favorites}
            onSelectSummoner={searchSummoner}
            onRemoveFavorite={removeFavorite}/>
              </div>
            </div>
          )}
          {/* main content */}
          <div className='flex-1 min-w-0'>

      <SearchBar
        onSearch={searchSummoner}
        loading={loading}
        onClearError={clearError}/>

        {error && (
          <div className='bg-red-900/50 border border-red-500 text-red-100 p-6 rounded-lg mb-6 max-w-2xl mx-auto'>
            <div className='flex items-start gap-3'>
              <span className='text-2xl'>⚠️</span>
              <div className='flex-1'>
                <p className='font-bold text-lg mb-2'>Summoner Not Found</p>
                <p className='text-sm mb-3'>{error}</p>
                <div className='bg-red-950/30 p-3 rounded text-xs'>
                  <p className='font-semibold mb-1'>💡 Troubleshooting Tips:</p>
                  <ul className='list-disc list-inside space-y-1 text-red-200'>
                    <li>Double-check the summoner name and tag spelling</li>
                    <li>Make sure you selected the correct region</li>
                    <li>Try searching in a different region if you're not sure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {summoner && (
          <SummonerProfile
          summoner={summoner}
          summonerDetails={summonerDetails}
          rankedInfo={rankedInfo}
          region={currentRegion}
          user={user}
          isFavorited={isFavorited}
          onToggleFavorite={() => toggleFavorite(summoner, isFavorited)}/>
        )}

        <MatchList matchDetails={matchDetails}
          summoner={summoner}
          expandedMatch={expandedMatch}
          setExpandedMatch={setExpandedMatch}
          coaching={coaching}
          loadingCoaching={loadingCoaching}
          getCoaching={getCoaching}
          loading={loading}
          onLoadMore={loadMoreMatches}
          totalMatches={matches.length}
          />
            </div>
          </div>
    </main>
  </div>
  </>
    
  );
}
