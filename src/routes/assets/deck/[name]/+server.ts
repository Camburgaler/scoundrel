import { GET_DECK, TTRPG_LEGACY_COMMON } from '$lib/constants.js';
import { pool } from '$lib/neon_client';
import type { AssetRow } from '$lib/types/assets.js';

function isTtrpgLegacy(name: string): boolean {
    return name.startsWith('TTRPG Legacy');
}

export async function GET({ params }) {
    const name = params.name.split('%20');
    console.log(name);

    let rows: AssetRow[];

    if (isTtrpgLegacy(name.join(' '))) {
        // name = ['TTRPG', 'Legacy', '({Race}', '{Color}', '{Design})']
        const [_, __, race, color, design] = name;
        const jokers = await pool.query(GET_DECK(TTRPG_LEGACY_COMMON));
        const commonDeckVariant = '(Common ' + ' ' + color + ' ' + design + ')';
        const commonCards = await pool.query(GET_DECK('TTRPG Legacy ' + commonDeckVariant));
        const faceCards = await pool.query(GET_DECK(name.join(' ')));

        rows = [...jokers.rows, ...commonCards.rows, ...faceCards.rows];
    } else {
        rows = (await pool.query(GET_DECK(name.join(' ')))).rows;
    }

    console.log(rows);

    return new Response(JSON.stringify(rows));
}
