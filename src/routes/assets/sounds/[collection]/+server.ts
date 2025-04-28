import { GET_SOUNDS } from '$lib/constants.js';
import { pool } from '$lib/neon_client';

export async function GET({ params }) {
    const name = params.collection;
    console.log(name);

    const result = await pool.query(GET_SOUNDS(name));

    console.log(result.rows);

    return new Response(JSON.stringify(result.rows));
}
