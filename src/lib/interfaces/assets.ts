import type { CardSuit } from '$lib/constants';
import type { UUID } from 'crypto';

type AssetType = 'card_back' | 'card_face' | 'die' | 'sound_card' | 'sound_dice';

export interface AssetRow {
    id: UUID;
    type: AssetType;
    suit: CardSuit;
    url: string;
    collection: string;
    value: number;
    source: string;
}
