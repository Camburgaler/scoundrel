import { GET_TABLE } from '$lib/constants.js';
import { pool } from '$lib/utils/neon_client';

export async function GET({ params }) {
    const name = params.name.split('%20');
    // console.log(name);

    const result = await pool.query(GET_TABLE(name.join(' ')));

    // console.log(result.rows);

    return new Response(JSON.stringify(result.rows[0]));
}
