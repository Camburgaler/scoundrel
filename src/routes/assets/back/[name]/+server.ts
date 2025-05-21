import { GET_BACK } from '$lib/constants.js';
import { pool } from '$lib/utils/neon_client';

export async function GET({ params }) {
    const name = params.name.split('%20');
    // console.log(name);

    const result = await pool.query(GET_BACK(name.join(' ')));

    // console.log(result.rows);

    return new Response(JSON.stringify(result.rows));
}
