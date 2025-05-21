import { GET_TABLE_NAMES } from '$lib/constants.js';
import { pool } from '$lib/utils/neon_client';

export async function GET() {
    const result = await pool.query(GET_TABLE_NAMES);

    // console.log(result.rows);

    return new Response(JSON.stringify(result.rows));
}
