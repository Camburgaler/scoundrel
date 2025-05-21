export const R2_PUBLIC_BASE = 'https://scoundrel.camburgaler.com/';

// Constant Values
export const CACHE_EXPIRATION = 86400000; // 24hrs

// Helper Types
export type CardSuit = 'clubs' | 'diamonds' | 'hearts' | 'spades' | 'jokers';

// Paths
export const ASSETS_BACK = '/assets/back/';
export const ASSETS_TABLE = '/assets/table/';
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
    [13, 'King'],
]);
export const VALUE_TO_DAMAGE: Map<number, number> = new Map([
    [1, 14],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 7],
    [8, 8],
    [9, 9],
    [10, 10],
    [11, 11],
    [12, 12],
    [13, 13],
]);

// Initial Values
export const INITIAL_DECK_CONTENTS: { suit: CardSuit; value: number }[] = [
    { suit: 'spades', value: 1 },
    { suit: 'spades', value: 2 },
    { suit: 'spades', value: 3 },
    { suit: 'spades', value: 4 },
    { suit: 'spades', value: 5 },
    { suit: 'spades', value: 6 },
    { suit: 'spades', value: 7 },
    { suit: 'spades', value: 8 },
    { suit: 'spades', value: 9 },
    { suit: 'spades', value: 10 },
    { suit: 'spades', value: 11 },
    { suit: 'spades', value: 12 },
    { suit: 'spades', value: 13 },
    { suit: 'hearts', value: 2 },
    { suit: 'hearts', value: 3 },
    { suit: 'hearts', value: 4 },
    { suit: 'hearts', value: 5 },
    { suit: 'hearts', value: 6 },
    { suit: 'hearts', value: 7 },
    { suit: 'hearts', value: 8 },
    { suit: 'hearts', value: 9 },
    { suit: 'hearts', value: 10 },
    { suit: 'diamonds', value: 2 },
    { suit: 'diamonds', value: 3 },
    { suit: 'diamonds', value: 4 },
    { suit: 'diamonds', value: 5 },
    { suit: 'diamonds', value: 6 },
    { suit: 'diamonds', value: 7 },
    { suit: 'diamonds', value: 8 },
    { suit: 'diamonds', value: 9 },
    { suit: 'diamonds', value: 10 },
    { suit: 'clubs', value: 1 },
    { suit: 'clubs', value: 2 },
    { suit: 'clubs', value: 3 },
    { suit: 'clubs', value: 4 },
    { suit: 'clubs', value: 5 },
    { suit: 'clubs', value: 6 },
    { suit: 'clubs', value: 7 },
    { suit: 'clubs', value: 8 },
    { suit: 'clubs', value: 9 },
    { suit: 'clubs', value: 10 },
    { suit: 'clubs', value: 11 },
    { suit: 'clubs', value: 12 },
    { suit: 'clubs', value: 13 },
];

// Deck Names
export const TTRPG_LEGACY_COMMON = 'TTRPG Legacy (Common)';
export const BYRON_KNOLL = 'Byron Knoll';

// Back Names
export const ABJIKLAM = 'Abjiklam';

// Table Names
export const KALPONIC_STUDIO_PLANKS_LIGHT = 'Kalponic Studio (Planks Light)';

// Die Names
export const PAINRATIO_EMERALD = 'PAINratio (Emerald)';

// PostgreSQL Queries
export const GET_DECK = (name: string) =>
    "SELECT * FROM assets WHERE type = 'card_face' AND collection = '" + name + "'";
export const GET_BACK = (name: string) =>
    "SELECT * FROM assets WHERE type = 'card_back' AND collection = '" + name + "'";
export const GET_TABLE = (name: string) =>
    "SELECT * FROM assets WHERE type = 'table' AND collection = '" + name + "'";
export const GET_DIE = (name: string) =>
    "SELECT * FROM assets WHERE type = 'die' AND collection = '" + name + "'";
export const GET_SOUNDS = (collection: string) =>
    "SELECT * FROM assets WHERE type = 'sound_" + collection + "'";
