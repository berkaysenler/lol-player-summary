// Utility functions for Riot API 

export function getRankIcon(tier: string) : string | null {
    if (!tier) return null;
    return `https://opgg-static.akamaized.net/images/medals_new/${tier.toLowerCase()}.png`
}

export function getRankForQueue (rankedData: any[], queueType: string){
    if(!rankedData) return null;
    return rankedData.find((entry: any) => entry.queueType === queueType)
}

export function calculateWinrate(wins: number, losses: number): number{
    if(wins + losses === 0) return 0;
    return Math.round((wins / (wins + losses)) * 100)
}

export function getProfileIconUrl(iconId: number): string {
    return `https://ddragon.leagueoflegends.com/cdn/15.23.1/img/profileicon/${iconId}.png`
}

export function getChampionSplashUrl(championName: string): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`
}

export function getItemIconUrl(itemId: number):string {
    return `https://ddragon.leagueoflegends.com/cdn/15.23.1/img/item/${itemId}.png`
}