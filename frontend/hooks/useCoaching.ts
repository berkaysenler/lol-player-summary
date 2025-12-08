import { useState } from 'react';
import { api } from '@/lib/api';

export function useCoaching() {

    const [coaching, setCoaching] = useState<{ [key: string]: string }>({});
    const [loadingCoaching, setLoadingCoaching] = useState<string | null>(null);


    const getCoaching = async (matchId: string, playerStats: any) => {
            setLoadingCoaching(matchId);

            try {
                const data = await api.getCoaching(playerStats); 
                setCoaching((prev) => ({ ...prev, [matchId]: data.coaching }));
            } catch (err: any){
                console.error('Error getting coaching:', err);
                          setCoaching((prev) => ({
                            ...prev,
                            [matchId]: 'Failed to load coaching analysis. Please try again.',
                          }));
            } finally {
                setLoadingCoaching(null);
            }
};
            const resetCoaching = () => { 
                setCoaching({}); 
            };

            return { coaching, loadingCoaching, getCoaching, resetCoaching };
}

