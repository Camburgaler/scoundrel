import { CACHE_EXPIRATION } from '$lib/constants';
import type { AssetRow } from '$lib/interfaces/assets';

type CacheData = {
    timestamp: number;
    rows: AssetRow[];
};

export async function getAssetsWithLocalCache(url: string): Promise<AssetRow[]> {
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

export async function cacheImage(url: string): Promise<string> {
    const cache = await caches.open('scoundrel-assets');
    const cached = await cache.match(url);

    if (cached) return url;

    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
        await cache.put(url, response.clone());
    }
    return url;
}
