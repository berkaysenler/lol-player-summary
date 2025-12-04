'use client';
import { useState, useEffect } from 'react';
import MatchCard from './components/MatchCard';
import {supabase} from '@/lib/supabase'
import Navbar from './components/Navbar';
import SummonerProfile from './components/SummonerProfile';
import MatchList from './components/MatchList';
import SearchBar from './components/SearchBar';
import FavoritesSidebar from './components/FavoritesSideBar';


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
  const [loading, setLoading] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [coaching, setCoaching] = useState<{[key: string]: string}>({})
  const [loadingCoaching, setLoadingCoaching] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [summonerDetails, setSummonerDetails] = useState<any>(null)
  const [rankedInfo, setRankedInfo] = useState<any[]>([])
  const [matchesDisplayed, setMatchesDisplayed] = useState(5)


  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({
      data:{session}
    }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser)
      console.log('Session user:', currentUser)
      if(currentUser){
        loadFavorites()
      }
    })

    // Listen for auth changes
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_even, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser)
      if(currentUser){
        loadFavorites()
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if(user) {
      loadFavorites();
    }
  }, [user])

  async function getCoaching(matchId: string, playerStats: any){
    setLoadingCoaching(matchId);

    try {
      const response = await fetch('http://localhost:3001/api/coaching', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(playerStats)
      })

      if (!response.ok) {
        throw new Error('Failed to get coaching analysis');
      }

      const data = await response.json();
      setCoaching(prev => ({...prev, [matchId]: data.coaching }))
    } catch (err: any) {
      console.error('Error getting coaching:', err)
      setCoaching(prev => ({...prev, [matchId]: 'Failed to load coaching analysis. Please try again.' }))
    } finally {
      setLoadingCoaching(null)
    }
  }




  async function searchSummoner(gameName: string, tagLine: string){
    setLoading(true)
    setError(null)

    setSummoner(null);
    setSummonerDetails(null)
    setRankedInfo([])
    setMatchesDisplayed(5)
    setMatches([]);
    setMatchDetails([]);
    setCoaching({});
    setExpandedMatch(null);

    try {
      const summonerRes = await fetch(`http://localhost:3001/api/summoner/${gameName}/${tagLine}`);

      if (!summonerRes.ok) {
        const errorData = await summonerRes.json();
        throw new Error(errorData.error || 'Failed to fetch summoner data');
      }

      const summonerData = await summonerRes.json();
      setSummoner(summonerData);

      const [detailsRes, rankedRes] = await Promise.all([fetch(`http://localhost:3001/api/summoner/by-puuid/${summonerData.puuid}`), fetch(`http://localhost:3001/api/ranked/${summonerData.puuid}`)])

      const details = detailsRes.ok ? await detailsRes.json() : null;
      const ranked = rankedRes. ok ? await rankedRes.json() : [];

      setSummonerDetails(details)
      setRankedInfo(ranked)

      const matchesRes = await fetch(`http://localhost:3001/api/matches/${summonerData.puuid}`);

      if (!matchesRes.ok) {
        const errorData = await matchesRes.json();
        throw new Error(errorData.error || 'Failed to fetch match data');
      }

      const matchesData = await matchesRes.json()
      console.log('Matches data:', matchesData)

      if(!Array.isArray(matchesData)) {
        console.error('Expected array but got:', matchesData)
        throw new Error('Invalid match data received');
      }

      setMatches(matchesData)

      const detailsPromises = matchesData.slice(0, matchesDisplayed).map((matchId:string) =>
        fetch(`http://localhost:3001/api/match/${matchId}`)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch match details');
            return res.json();
          })
      )

      const detailsData = await Promise.all(detailsPromises)
      setMatchDetails(detailsData)
    } catch (err: any) {
      console.error('Error searching summoner:', err)
      setError(err.message || 'An error occurred while searching for the summoner')
    } finally {
      setLoading(false)
    }
  }




  async function loadMoreMatches(){
    if(!matches || matches.length === 0) return

    const newDisplayCount = matchesDisplayed + 5;
    const matchesToFetch = matches.slice(matchesDisplayed, newDisplayCount)

    setLoading(true)

    try{
      const detailsPromises = matchesToFetch.map((matchId: string) => fetch(`http://localhost:3001/api/match/${matchId}`).then(res => {
        if(!res.ok) throw new Error('Failed to fetch match details');
        return res.json()
      }))

      const newDetails = await Promise.all(detailsPromises)
      setMatchDetails([...matchDetails, ...newDetails])

      setMatchesDisplayed(newDisplayCount)
    } catch (err: any){
      console.error('Error loading more matches:', err)
      setError(err.message || 'Failed to load more matches')
    } finally {
      setLoading(false)
    }
  }



  async function handleLogout(){
    await supabase.auth.signOut()
    setUser(null)
  }

  const [favoriteSummoners, setFavoriteSummoners] = useState<any>([])

  async function loadFavorites() {
    console.log('loadFavorites called, user:', user);

    if (!user) {
      console.log('No user, skipping favorites load');
      return;
    }

    console.log('Fetching favorites for user:', user.id);

    try {
      const { data, error } = await supabase
        .from('favorite_summoners')
        .select('*')
        .eq('user_id', user.id);

      console.log('Favorites data:', data);
      console.log('Favorites error:', error);

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      // Fetch detailed info for each favorite
      const enrichedFavorites = await Promise.all(
        (data || []).map(async (fav) => {
          try {
            // Fetch summoner details and ranked info in parallel
            const [summonerRes, rankedRes] = await Promise.all([
              fetch(`http://localhost:3001/api/summoner/by-puuid/${fav.puuid}`),
              fetch(`http://localhost:3001/api/ranked/${fav.puuid}`)
            ]);

            const summonerData = summonerRes.ok ? await summonerRes.json() : null;
            const rankedData = rankedRes.ok ? await rankedRes.json() : [];

            return {
              ...fav,
              profileIconId: summonerData?.profileIconId,
              summonerLevel: summonerData?.summonerLevel,
              rankedData: rankedData
            };
          } catch (err) {
            console.error('Error fetching details for', fav.game_name, err);
            return fav; // Return basic data if fetch fails
          }
        })
      );

      setFavoriteSummoners(enrichedFavorites);
      console.log('Set enriched favorites:', enrichedFavorites);
    } catch (err) {
      console.error('Error in loadFavorites:', err);
    }
  }

  async function toggleFavorite(){
    if(!user || !summoner) return;

    const isFavorited = favoriteSummoners.some((fav:any) => fav.puuid === summoner.puuid);

    if(isFavorited){
      const {error} = await supabase.from('favorite_summoners').delete().eq('user_id',user.id).eq('puuid', summoner.puuid)

      if(!error) loadFavorites();
    } else{
      const {error} = await supabase.from('favorite_summoners').insert({
        user_id: user.id,
        puuid: summoner.puuid,
        game_name: summoner.gameName,
        tag_line: summoner.tagLine
      })
      if(!error) loadFavorites()
    }
  }

  async function removeFavorite(puuid: string) {
    if(!user) return;

    const{error} = await supabase.from('favorite_summoners').delete().eq('user_id', user.id).eq('puuid', puuid)

    if(!error) {
      loadFavorites()

      if(summoner?.puuid === puuid) {
        setSummoner(null)
        setMatches([])
        setMatchDetails([])
      }
    }
  }

  return (
    <main className='min-h-screen bg-gray-800 text-white p-8'>
      <Navbar user={user}
        onLogout={handleLogout}/>

        <div className='flex gap-6'>
          {/* left sidebar - only if user is logged in */}
          {user && (
            <div className='w-90 flex-shrink-0'>
              <div className='sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto'>
            <FavoritesSidebar favorites={favoriteSummoners}
            onSelectSummoner={searchSummoner}
            onRemoveFavorite={removeFavorite}/>
              </div>
            </div>
          )}
          {/* main content */}
          <div className='flex-1 min-w-0'>

      <SearchBar onSearch={searchSummoner}
        loading={loading}/>

        {error && (
          <div className='bg-red-500 text-white p-4 rounded-lg mb-4'>
            <p className='font-semibold'>Error: {error}</p>
          </div>
        )}

        {summoner && (
          <SummonerProfile 
          summoner={summoner}
          summonerDetails={summonerDetails}
          rankedInfo={rankedInfo}
          user={user}
          isFavorited={favoriteSummoners.some((fav:any) => fav.puuid === summoner.puuid)}
          onToggleFavorite={toggleFavorite}/>
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
    
  );
}
