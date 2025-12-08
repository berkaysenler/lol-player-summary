const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function apiClient(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type':
            'application/json',
            ...options?.headers,
        },
        ...options,
    })

    if(!response.ok){
        const error = await response.json().catch(() => ({ error: 'Request failed'}))
        throw new Error(error.error || 'API request failed')
    }

    return response.json();
}

export const api = {
    getSummoner: (gameName: string, tagLine: string, region: string = 'OCE') =>
        apiClient(`/api/summoner/${gameName}/${tagLine}?region=${region}`),

    getSummonerDetails: (puuid: string, region: string = 'OCE') =>
        apiClient(`/api/summoner/by-puuid/${puuid}?region=${region}`),

    getRankedInfo: (puuid: string, region: string = 'OCE') =>
        apiClient(`/api/ranked/${puuid}?region=${region}`),

    getMatches: (puuid: string, region: string = 'OCE') =>
        apiClient(`/api/matches/${puuid}?region=${region}`),

    getMatchDetails: (matchId: string, region: string = 'OCE') =>
        apiClient(`/api/match/${matchId}?region=${region}`),

    getCoaching: (playerStats: any) => apiClient('/api/coaching',
        {
          method: 'POST',
          body: JSON.stringify(playerStats),
        }),
}