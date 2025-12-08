import { useState } from 'react';
import { api } from '@/lib/api';

export function useSummonerSearch(){

    const [summoner, setSummoner] = useState<any>(null);
    const [summonerDetails, setSummonerDetails] = useState<any>(null);
    const [rankedInfo, setRankedInfo] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [matchDetails, setMatchDetails] = useState<any[]>([]);
    const [matchesDisplayed, setMatchesDisplayed] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentRegion, setCurrentRegion] = useState<string>('OCE');


    const searchSummoner = async (gameName: string, tagLine: string, region: string = 'OCE') => {
        setLoading(true);
        setError(null);
        setCurrentRegion(region);

        //Reset All state
        setSummoner(null);
        setSummonerDetails(null);
        setRankedInfo([]);
        setMatchesDisplayed(5);
        setMatches([]);
        setMatchDetails([]);

        try{
            // Fetch summoner basic info
            const summonerData = await api.getSummoner(gameName, tagLine, region);
            setSummoner(summonerData);

            //Fetch summoner details and ranked info in parallel
            const [details, ranked] = await Promise.all([
            api.getSummonerDetails(summonerData.puuid, region),
            api.getRankedInfo(summonerData.puuid, region),
            ]);

            setSummonerDetails(details);
            setRankedInfo(ranked);

            // Fetch match list
            const matchesData = await api.getMatches(summonerData.puuid, region);

            if (!Array.isArray(matchesData)) {
                throw new Error('Invalid match data received');
              }

              setMatches(matchesData);

              // Fetch details for first 5 matches
              const detailsData = await Promise.all(
                matchesData.slice(0, 5).map((matchId: string) => api.getMatchDetails(matchId, region))
            );
            setMatchDetails(detailsData);
        } catch (err: any){
            console.error('Error searching summoner:', err);
            setError(err.message || 'An error occurred while searching for the summoner');
        } finally {
            setLoading(false);
        }
    };

    const loadMoreMatches = async () => {
        if (!matches || matches.length === 0) return;


    const newDisplayCount = matchesDisplayed + 5;
    const matchesToFetch = matches.slice(matchesDisplayed, newDisplayCount);

    setLoading(true);


    try {
        const newDetails = await Promise.all(
          matchesToFetch.map((matchId: string) => api.getMatchDetails(matchId, currentRegion))
        );
        setMatchDetails([...matchDetails, ...newDetails]);
        setMatchesDisplayed(newDisplayCount);
      } catch (err: any) {
        console.error('Error loading more matches:', err);
        setError(err.message || 'Failed to load more matches');
      } finally {
        setLoading(false);
      }
    };

    const clearError = () => {
      setError(null);
    };

    return {
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
    };
}
