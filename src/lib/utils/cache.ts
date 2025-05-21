import { CACHE_EXPIRATION } from '$lib/constants';

type CacheData = {
    timestamp: number;
    rows: any[];
};

export async function getAssetsWithLocalCache(url: string): Promise<any> {
    const cached: string | null = localStorage.getItem(url);
    if (cached) {
        const data: CacheData = JSON.parse(cached);
        if (Date.now() - data.timestamp > CACHE_EXPIRATION) {
            localStorage.removeItem(url);
        } else {
            return data.rows;
        }
    }

    const res = await fetch(url);
    const data = await res.json();
    localStorage.setItem(url, JSON.stringify({ timestamp: Date.now(), rows: data }));
    return data;
}
