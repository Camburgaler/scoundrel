type CacheData = {
    timestamp: number;
    rows: any[];
};

export async function getAssetsWithLocalCache(url: string): Promise<any> {
    const cached: string | null = localStorage.getItem(url);
    if (cached) {
        const data: CacheData = JSON.parse(cached);

        // re-enable cache expiration when customization is implemented
        // if (Date.now() - data.timestamp > CACHE_EXPIRATION) {
        //     localStorage.removeItem(url);
        // } else {
        //     return data.rows;
        // }

        return data.rows;
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await res.json();
    localStorage.setItem(url, JSON.stringify({ timestamp: Date.now(), rows: data }));
    return data;
}
