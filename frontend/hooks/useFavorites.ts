import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

export function useFavorites(user: any){
    const [favorites, setFavorites] = useState<any[]>([]);

    const loadFavorites = async () => {
        if(!user) {
            setFavorites([]);
            return;
        }

        try {
            const {data, error} = await supabase
            .from('favorite_summoners')
            .select('*')
            .eq('user_id', user.id);

            if(error) throw error;

            // Enrich favorites with summoner details
            const enrichedFavorites = await Promise.all((data || []).map(async (fav: any) => {
                try {
                    const [summonerData, rankedData] =  await Promise.all([
                        api.getSummonerDetails(fav.puuid, 'OCE'),
                        api.getRankedInfo(fav.puuid, 'OCE'),
                    ]);
                    
                    return {
                        ...fav, 
                        profileIconId: summonerData?.profileIconId,
                        summonerLevel: summonerData?.summonerLevel, 
                        rankedData,
                    };
                } catch {
                    return fav;
                }
            })
        )
            setFavorites(enrichedFavorites)
        } catch (err) {
            console.error('Error loading favorites', err);
        }
    };

    const toggleFavorite = async (summoner: any, isFavorited: boolean) => {
        if(!user || !summoner) return;

        if(isFavorited) {
            await supabase
            .from('favorite_summoners')
            .delete()
            .eq('user_id', user.id)
            .eq('puuid', summoner.puuid)
        } else{
            await supabase.from('favorite_summoners').insert({
                user_id: user.id,
                puuid: summoner.puuid,
                game_name: summoner.gameName,
                tag_line: summoner.tagLine,
            });
        }
        loadFavorites();
    };

    const removeFavorite = async (puuid: string) => {
        if(!user) return;

        await supabase
            .from('favorite_summoners')
            .delete()
            .eq('user_id', user.id)
            .eq('puuid', puuid);

        loadFavorites();
    };

    useEffect(() => {
        loadFavorites();
    }, [user]);

    return { favorites, toggleFavorite, removeFavorite };
}