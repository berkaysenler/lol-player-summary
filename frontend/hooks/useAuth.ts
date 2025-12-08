import { useState, useEffect } from 'react';
import {supabase } from '@/lib/supabase';


export function useAuth(){
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        //Get initial session
        supabase.auth.getSession().then(({
            data: { session } 
        }) => {
            setUser(session?.user ?? null);
        });
        //Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

        const logout = async () => {
            await supabase.auth.signOut();
            setUser(null);
        };

        return { user, logout}
}

