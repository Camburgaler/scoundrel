import type { CardSuit } from '$lib/constants';

export interface Card {
    suit: CardSuit;
    value: number;
}
