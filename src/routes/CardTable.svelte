<script lang="ts">
    // Imports
    import { INITIAL_DECK_CONTENTS, VALUE_TO_DAMAGE, VALUE_TO_RANK } from '$lib/constants';
    import type { AssetRow } from '$lib/interfaces/assets';
    import type { Card } from '$lib/interfaces/card';
    import { onMount } from 'svelte';

    // Constants
    const MARGIN = 6;
    const MAX_HEALTH = 20;
    const TRANSPARENT = 'transparent';
    const BLACK_BACKGROUND = 'rgba(0, 0, 0, 0.2)';
    const WHITE_BACKGROUND = 'rgba(255, 255, 255, 0.2)';
    const RED_BACKGROUND = 'rgba(255, 0, 0, 0.2)';
    const GREEN_BACKGROUND = 'rgba(0, 255, 0, 0.2)';

    // Props
    let {
        deckAssets,
        cardBackAsset,
        dieAssets,
    }: { deckAssets: AssetRow[]; cardBackAsset: AssetRow | undefined; dieAssets: AssetRow[] } =
        $props();

    // Reactive Value
    let cardTable: HTMLDivElement;
    let cardSize = $state({ width: 100, height: 145 });
    let deck: Card[] = $state([...INITIAL_DECK_CONTENTS]);
    let room: Card[] = $state([]); // cards in the room
    let weapon: number = $state(0);
    let defeatedMonsters: Card[] = $state([]);
    let isGameStarted = $state(false); // whether the game has started
    let health = $state(20); // player health
    let isPotionUsed = $state(false); // whether a potion has been used in this room
    let ranFromPreviousRoom = $state(false); // whether the player ran from the previous room

    // Hovered States
    let hovered = $state({
        monster: 0,
        roomWeapon: 0,
        potion: 0,
        equippedWeapon: false,
        run: false,
    });

    // Lifecycle: Resize Handling
    onMount(() => {
        const resize = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            const ratio = width / height;

            const cardWidth =
                ratio < 2.75
                    ? width / 8 - MARGIN * 2
                    : (height / 2 - MARGIN * 2 - height / 10) / 1.45;
            const cardHeight =
                ratio < 2.75 ? cardWidth * 1.45 : height / 2 - MARGIN * 2 - height / 10;

            cardSize = { width: cardWidth, height: cardHeight };
        });

        resize.observe(cardTable);
        return () => resize.disconnect();
    });

    // Derived/Helper Functions
    const isThisRoomCardHovered = (index: number) => {
        return (
            (hovered.monster && hovered.monster - 1 === index) ||
            (hovered.roomWeapon && hovered.roomWeapon - 1 === index) ||
            (hovered.potion && hovered.potion - 1 === index)
        );
    };

    function canUseWeapon(monster: Card): boolean {
        // if there are defeated monsters,
        //     then return whether the monster's value is less than the value of the last defeated monster
        // else
        //     return whether the equipped weapon is greater than 0
        return defeatedMonsters.length
            ? VALUE_TO_DAMAGE.get(monster.value)! <
                  VALUE_TO_DAMAGE.get(defeatedMonsters.at(-1)!.value)!
            : weapon > 0;
    }

    function getEffectiveWeaponValue(monsterIndex: number): number {
        const monster = room[monsterIndex];

        if (!canUseWeapon(monster)) {
            return 0;
        }

        if (defeatedMonsters.length === 0) {
            return weapon;
        }

        return Math.min(weapon, VALUE_TO_DAMAGE.get(defeatedMonsters.at(-1)!.value)!);
    }

    function getNewHealth(monsterIndex: number): number {
        const damage = Math.max(
            0,
            VALUE_TO_DAMAGE.get(room[monsterIndex].value)! - getEffectiveWeaponValue(monsterIndex),
        );
        return Math.max(health - damage, 0);
    }

    function findDeckAssetByCard(card: Card): AssetRow | undefined {
        return deckAssets.find((a) => a.suit === card.suit && a.value === card.value);
    }

    // Game Logic
    function startGame() {
        // reset the deck
        deck = [...INITIAL_DECK_CONTENTS].sort(() => Math.random() - 0.5);
        // add animation here to have entire deck quickly slide in from off screen
        // add animation here for shuffling the deck
        //     deck slides into center of screen
        //     spawn another card back on top of the deck
        //     horizontally slide both card backs away from each other slightly
        //     spawn another card back on top of the right card back
        //     slide the third card back into the center between the two "halves" of the deck
        //     persist the third card back until the deck is fully shuffled
        //     repeat the process 43 more times for the rest of the deck, alternating between the two "halves", deleting each card back once its animation is complete
        //     on the last iterations from each "half", the first and second card back will be deleted after their animations are complete
        //     slide the third card back to the deck's original position
        //     simultaneously
        //         fade out the third card back
        //         fade in the actual deck asset

        // reset room
        room = [];

        // reset weapon
        weapon = 0;

        // reset defeated monsters
        defeatedMonsters = [];

        // reset health
        health = MAX_HEALTH;

        // reset isPotionUsed
        isPotionUsed = false;

        // reset ranFromPreviousRoom
        ranFromPreviousRoom = false;

        // reset hovered states
        hovered = {
            monster: 0,
            roomWeapon: 0,
            potion: 0,
            equippedWeapon: false,
            run: false,
        };

        getRoom();
        isGameStarted = true;
    }

    function getRoom() {
        while (room.length < 4 && deck.length > 0) {
            // add animation here for reflling the room
            //     spawn a card back on top of the deck
            //     simulataneously
            //         slide the card back into the its spot in the room
            //         flip the card back over to reveal the card
            room.push(deck.shift()!);
        }
        isPotionUsed = false;
    }

    function equipWeapon(index: number) {
        if (weapon > 0) return;

        weapon = room[index].value;
        room.splice(index, 1);
        hovered.roomWeapon = 0;
        ranFromPreviousRoom = false;
        // add animation here to equip the weapon
        //     slide weapon card from room to weapon slot
    }

    function drinkPotion(index: number) {
        if (!isPotionUsed) {
            health = Math.min(health + room[index].value, MAX_HEALTH);
        }
        room.splice(index, 1);
        isPotionUsed = true;
        hovered.potion = 0;
        ranFromPreviousRoom = false;
        // add animation here to drink the potion
        //     slide potion card from room to health
        //     simultaneously
        //         shrink card
        //         fade out card
    }

    function fightMonster(index: number) {
        const effective = getEffectiveWeaponValue(index);
        const monsterValue = VALUE_TO_DAMAGE.get(room[index].value)!;

        if (effective < monsterValue) {
            health = getNewHealth(index);
        }

        if (weapon && canUseWeapon(room[index])) {
            defeatedMonsters.push(room[index]);
        }

        room.splice(index, 1);
        hovered.monster = 0;

        if (health === 0) {
            isGameStarted = false;
            room = [];
            weapon = 0;
            defeatedMonsters = [];
        }

        ranFromPreviousRoom = false;
    }

    function interactWithRoom(index: number) {
        if (hovered.roomWeapon) equipWeapon(index);
        if (hovered.potion) drinkPotion(index);
        if (hovered.monster) fightMonster(index);
        if (room.length === 1) getRoom();
    }

    function isHoveredMonsterDamageGreaterThanWeapon(): boolean {
        return (
            hovered.monster > 0 &&
            VALUE_TO_DAMAGE.get(room[hovered.monster - 1].value)! -
                getEffectiveWeaponValue(hovered.monster - 1) >
                0
        );
    }

    function interpretMove(): string {
        if (hovered.monster) {
            const index = hovered.monster - 1;
            const lostHealth = health - getNewHealth(index);

            return `DAMAGE: ${lostHealth}${getNewHealth(index) === 0 ? ' (THIS WILL KILL YOU)' : ''}`;
        }

        if (hovered.roomWeapon)
            return weapon > 0 ? 'DISCARD CURRENT WEAPON TO EQUIP THIS ONE' : 'EQUIP WEAPON';
        if (hovered.equippedWeapon) return 'DISCARD WEAPON';
        if (hovered.potion)
            return isPotionUsed
                ? 'DISCARD POTION'
                : 'RECOVER: ' +
                      Math.min(MAX_HEALTH - health, room[hovered.potion - 1].value).toString();
        if (hovered.run && isGameStarted)
            return ranFromPreviousRoom ? 'YOU ARE STUCK HERE' : 'RUN FROM THIS ROOM';
        return '';
    }
</script>

<div bind:this={cardTable} class="table-area">
    <!-- deck -->
    <div
        style="
        width: {cardSize.width}px; 
        height: {cardSize.height}px; 
        object-fit: contain; 
        margin: {MARGIN}px;
        background-color: {TRANSPARENT};
        border: none;
        "
    >
        {#if isGameStarted}
            <button
                class="button-wrapper"
                style="
                width: 100%;
                height: 100%; 
                background-color: {TRANSPARENT};
                border: none;
                "
            >
                {#if deck.length > 0}
                    <img
                        class="button-img"
                        src={cardBackAsset?.url}
                        alt="card back"
                        style="
                        width: 100%;
                        height: 100%;
                        "
                    />
                    <div class="overlay">
                        {deck.length}
                    </div>
                {:else}
                    <div
                        style="
                    width: {cardSize.width}px;
                    height: {cardSize.height}px;
                    object-fit: contain;
                    margin: {MARGIN}px;
                    background-color: {BLACK_BACKGROUND};
                    border-radius: 1rem;
                    "
                    ></div>
                {/if}
            </button>
        {:else}
            <button
                style="
            width: 100%;
            height: 100%; 
            background-color: {WHITE_BACKGROUND};
            border-radius: 1rem;
            font-size: 2rem;
            "
                onclick={startGame}
            >
                {health == 0 ? 'TRY AGAIN?' : 'START GAME'}
            </button>
        {/if}
    </div>

    <!-- information -->
    <div
        style="
            width: {cardSize.width}px; 
            height: {cardSize.height}px; 
            object-fit: contain; 
            margin: {MARGIN}px;
            font-size: 1.5rem;
            "
    >
        {interpretMove()}
    </div>

    <!-- buffer -->
    {#each [0, 1] as _}
        <div
            style="
            width: {cardSize.width}px; 
            height: {cardSize.height}px; 
            object-fit: contain; 
            margin: {MARGIN}px;
            "
        ></div>
    {/each}

    <!-- current room -->
    {#each [0, 1, 2, 3] as i}
        <div
            style="
                width: {cardSize.width}px;
                height: {cardSize.height}px;
                object-fit: contain;
                margin: {MARGIN}px;
                background-color: {room[i] ? TRANSPARENT : BLACK_BACKGROUND};
                border-radius: 1rem;
                "
        >
            {#if room[i]}
                <button
                    style="
                    width: 100%;
                    height: 100%;
                    background-color: {isThisRoomCardHovered(i)
                        ? (hovered.potion && isPotionUsed) || (hovered.roomWeapon && weapon > 0)
                            ? RED_BACKGROUND
                            : WHITE_BACKGROUND
                        : TRANSPARENT};
                    border: none;
                    border-radius: 1rem;
                    "
                    onclick={() => interactWithRoom(i)}
                >
                    <img
                        src={findDeckAssetByCard(room[i])?.url}
                        alt="{VALUE_TO_RANK.get(
                            findDeckAssetByCard(room[i])?.value!,
                        )} of {findDeckAssetByCard(room[i])?.suit}"
                        style="
                        width: 100%;
                        height: 100%;
                        "
                        onmouseenter={() => {
                            hovered.monster = ['spades', 'clubs'].includes(room[i].suit)
                                ? i + 1
                                : 0;
                            hovered.roomWeapon = room[i].suit === 'diamonds' ? i + 1 : 0;
                            hovered.potion = room[i].suit === 'hearts' ? i + 1 : 0;
                        }}
                        onmouseleave={() => {
                            hovered.monster = 0;
                            hovered.roomWeapon = 0;
                            hovered.potion = 0;
                        }}
                    /></button
                >
            {/if}
        </div>
    {/each}

    <hr style="width: 100%; background-color: #fff; height: 1px; border: none; " />

    <!-- health -->
    {#if dieAssets && deckAssets.find((asset: AssetRow) => asset.suit === 'jokers')}
        <button
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: {MARGIN}px;
            background-color: {isHoveredMonsterDamageGreaterThanWeapon()
                ? RED_BACKGROUND
                : hovered.potion && !isPotionUsed
                  ? GREEN_BACKGROUND
                  : TRANSPARENT};
            border: none;
            border-radius: 1rem;
            "
        >
            <img
                src={health === 0
                    ? deckAssets.find((asset: AssetRow) => asset.suit === 'jokers')?.url
                    : dieAssets.find((d) => d.value === health)?.url}
                alt="{health} health"
                style="
                width: 100%;
                "
            />
        </button>
    {:else}
        <div
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: {MARGIN}px;
            background-color: {BLACK_BACKGROUND};
            border-radius: 1rem;
            font-size: 2rem;
            "
        >
            {health}
        </div>
    {/if}

    <!-- weapon -->
    <div
        style="
        width: {cardSize.width}px;
        height: {cardSize.height}px;
        object-fit: contain;
        margin: {MARGIN}px;
        background-color: {weapon
            ? hovered.equippedWeapon || (hovered.monster && canUseWeapon(room[hovered.monster - 1]))
                ? RED_BACKGROUND
                : TRANSPARENT
            : hovered.roomWeapon
              ? GREEN_BACKGROUND
              : BLACK_BACKGROUND};
        border-radius: 1rem;
        "
    >
        {#if weapon}
            <button
                style="
                width: 100%;
                height: 100%;
                background-color: transparent;
                border: none;
                "
                onclick={() => {
                    weapon = 0;
                    while (defeatedMonsters.length > 0) {
                        defeatedMonsters.pop();
                    }
                    hovered.equippedWeapon = false;
                }}
            >
                <img
                    src={deckAssets.find((c) => c.value === weapon && c.suit === 'diamonds')?.url}
                    alt="{weapon} of diamonds"
                    style="
                width: 100%;
                height: 100%;
                "
                    onmouseenter={() => (hovered.equippedWeapon = true)}
                    onmouseleave={() => (hovered.equippedWeapon = false)}
                />
            </button>
        {/if}
    </div>

    <!-- enemies fought with the weapon -->
    {#each [0, 1, 2, 3, 4, 5] as i}
        <div
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: {MARGIN}px;
            "
        >
            {#if defeatedMonsters[defeatedMonsters.length - 1 - i]}
                <button
                    class="image-container"
                    style="
                    height: 100%; 
                    width: 100%;
                    background-color: {TRANSPARENT};
                    border: none;
                    "
                >
                    <img
                        src={deckAssets.find(
                            (c) =>
                                c.value ===
                                    defeatedMonsters[defeatedMonsters.length - 1 - i]?.value &&
                                c.suit === defeatedMonsters[defeatedMonsters.length - 1 - i]?.suit,
                        )?.url}
                        alt="{VALUE_TO_RANK.get(
                            defeatedMonsters[defeatedMonsters.length - 1 - i]?.value,
                        )} of {defeatedMonsters[defeatedMonsters.length - 1 - i]?.suit}"
                        style="
                        width: 100%;
                        height: 100%;
                        "
                    />
                    <svg class="x-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line
                            x1="0"
                            y1="0"
                            x2="100"
                            y2="100"
                            stroke="red"
                            stroke-width="10"
                            stroke-opacity="0.5"
                        />
                        <line
                            x1="100"
                            y1="0"
                            x2="0"
                            y2="100"
                            stroke="red"
                            stroke-width="10"
                            stroke-opacity="0.5"
                        />
                    </svg>
                </button>
            {:else}
                <div
                    style="
                    width: {cardSize.width}px;
                    height: {cardSize.height}px;
                    background-color: {BLACK_BACKGROUND};
                    border-radius: 1rem;
                    "
                ></div>
            {/if}
        </div>
    {/each}

    <!-- run button -->
    <button
        style="
        width: 100%;
        height: 10%;
        border-radius: 1rem;
        font-size: 2rem;
        "
        onclick={() => {
            while (room.length > 0) {
                ranFromPreviousRoom = true;
                const randomIndex = Math.floor(Math.random() * room.length);
                deck.push(room[randomIndex]);
                room.splice(randomIndex, 1);
            }
            getRoom();
        }}
        disabled={ranFromPreviousRoom || room.length < 4}
        onmouseenter={() => (hovered.run = true)}
        onmouseleave={() => (hovered.run = false)}
        >RUN!
    </button>
</div>

<style>
    .table-area {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: center;
        padding: 2rem;
        width: 100%;
        max-width: 90vw;
        height: 75vh;
        box-sizing: border-box;
        background-color: #35654d;
        border-radius: 2rem;
        box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.4);
    }

    .image-container {
        position: relative;
        display: inline-block;
    }

    .image-container img {
        display: block;
    }

    .x-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: 1rem;
    }

    .button-wrapper {
        position: relative;
        display: inline-block;
        padding: 0;
        border: none;
        background: none;
    }

    .overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none; /* allows clicks to pass through */
        font-size: 2rem;
        width: auto;
        height: auto;
        background-color: rgba(255, 255, 255, 0.7);
        padding: 0.5rem;
        border-radius: 1rem;
    }
</style>
