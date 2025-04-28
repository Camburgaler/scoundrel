export const R2_PUBLIC_BASE = 'https://scoundrel.camburgaler.com/';

// Paths
export const ASSETS_BACK = '/assets/back/';
export const ASSETS_DECK = '/assets/deck/';
export const ASSETS_DIE = '/assets/die/';
export const ASSETS_SOUNDS = '/assets/sounds/';

// Mappings
export const VALUE_TO_RANK: Map<number, string> = new Map([
    [1, 'Ace'],
    [2, 'Two'],
    [3, 'Three'],
    [4, 'Four'],
    [5, 'Five'],
    [6, 'Six'],
    [7, 'Seven'],
    [8, 'Eight'],
    [9, 'Nine'],
    [10, 'Ten'],
    [11, 'Jack'],
    [12, 'Queen'],
    [13, 'King']
]);

// Deck Names
export const TTRPG_LEGACY_COMMON = 'TTRPG Legacy (Common)';
export const BYRON_KNOLL = 'Byron Knoll';

// Back Names
export const ABJIKLAM = 'Abjiklam';

// Die Names
export const PAINRATIO_EMERALD = 'PAINratio (Emerald)';

// PostgreSQL Queries
export const GET_DECK = (name: string) =>
    "SELECT * FROM assets WHERE type = 'card_face' AND collection = '" + name + "'";
export const GET_BACK = (name: string) =>
    "SELECT * FROM assets WHERE type = 'card_back' AND collection = '" + name + "'";
export const GET_DIE = (name: string) =>
    "SELECT * FROM assets WHERE type = 'die' AND collection = '" + name + "'";
export const GET_SOUNDS = (collection: string) =>
    "SELECT * FROM assets WHERE type = 'sound_" + collection + "'";
