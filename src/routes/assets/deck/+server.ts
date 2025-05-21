import { GET_DECK_NAMES } from '$lib/constants.js';
import { pool } from '$lib/utils/neon_client';

export async function GET() {
    const result = await pool.query(GET_DECK_NAMES);

    const names: string[] = result.rows.map((row) => row.collection);

    // console.log(names);

    return new Response(JSON.stringify(names));
}
