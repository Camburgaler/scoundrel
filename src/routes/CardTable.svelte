<script lang="ts">
    import {
        ABJIKLAM,
        ASSETS_BACK,
        ASSETS_DECK,
        ASSETS_DIE,
        BYRON_KNOLL,
        ERROR_ANIMATION_DURATION,
        INITIAL_DECK_CONTENTS,
        PAINRATIO_EMERALD,
        VALUE_TO_RANK,
        type CardSuit,
    } from '$lib/constants';
    import ErrorSymbol from '$lib/ErrorSymbol.svelte';
    import type { AssetRow } from '$lib/interfaces/assets';
    import type { Card } from '$lib/interfaces/card';
    import { onMount } from 'svelte';

    let cardTable: HTMLDivElement;

    // initial deck is a full 54-card deck minus the jokers, the red face cards, and the red aces
    let deck: { suit: CardSuit; value: number }[] = $state([...INITIAL_DECK_CONTENTS]);
    let errorSymbols: string[] = $state([]);
    let deckAssets: AssetRow[] = $state([]);
    let cardBack: AssetRow | undefined = $state();
    let die: AssetRow[] = $state([]);
    let weapon: number = $state(0);
    let enemies: AssetRow[] = $state([]);
    let cardSize = $state({ width: 100, height: 145 });
    let room: Card[] = $state([]);
    let deckIsHovered = $state(false);
    let monsterIsHovered = $state(0);
    let weaponIsHovered = $state(0);
    let potionIsHovered = $state(0);

    async function loadData() {
        const deck_response = await fetch(ASSETS_DECK + BYRON_KNOLL.replace(' ', '%20'));
        deckAssets = await deck_response.json();

        const back_response = await fetch(ASSETS_BACK + ABJIKLAM);
        cardBack = (await back_response.json())[0];

        const die_response = await fetch(ASSETS_DIE + PAINRATIO_EMERALD.replace(' ', '%20'));
        die = await die_response.json();
    }

    onMount(() => {
        loadData();

        const resize = new ResizeObserver(([entry]) => {
            const { width } = entry.contentRect;
            const cardWidth = width / 8 - 12;
            const cardHeight = cardWidth * 1.45;

            cardSize = { width: cardWidth, height: cardHeight };
        });

        resize.observe(cardTable);

        // randomize the deck
        deck.sort(() => Math.random() - 0.5);

        return () => resize.disconnect();
    });

    function triggerError() {
        const id = crypto.randomUUID();
        errorSymbols = [...errorSymbols, id];

        setTimeout(() => {
            errorSymbols = errorSymbols.filter((e) => e !== id);
        }, ERROR_ANIMATION_DURATION);
    }

    function getRoom() {
        while (room.length < 4) {
            room.push(deck.shift()!);
        }
    }
</script>

<div bind:this={cardTable} class="table-area">
    <!-- deck -->
    <div
        style="
        width: {cardSize.width}px; 
        height: {cardSize.height}px; 
        object-fit: contain; 
        margin: 6px;
        background-color: {deckIsHovered
            ? deck.length > 0
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 0, 0, 0.2)'
            : 'transparent'};
        border: none;
        "
    >
        <button
            style="
            width: 100%;
            height: 100%; 
            background-color: transparent;
            border: none;
            "
            onclick={() => {
                if (deck.length === 0) {
                    triggerError();
                }
                getRoom();
            }}
            onmouseenter={() => (deckIsHovered = true)}
            onmouseleave={() => (deckIsHovered = false)}
        >
            <div class="error-container">
                {#each errorSymbols as id (id)}
                    <ErrorSymbol />
                {/each}
            </div>
            {#if deck.length > 0}
                <img
                    src={cardBack?.url}
                    alt="card back"
                    style="
                    width: 100%;
                    height: 100%;
                    "
                />
            {:else}
                <div
                    style="
                    width: {cardSize.width}px;
                    height: {cardSize.height}px;
                    object-fit: contain;
                    margin: 6px;
                    background-color: #000;
                    opacity: 0.2;
                    "
                ></div>
            {/if}
        </button>
    </div>

    <!-- buffer -->
    {#each [0, 1, 2] as _}
        <div
            style="
            width: {cardSize.width}px; 
            height: {cardSize.height}px; 
            object-fit: contain; 
            margin: 6px;
            "
        ></div>
    {/each}

    <!-- current room -->
    {#each [0, 1, 2, 3] as i}
        {#if room[i]}
            <button
                style="
                width: {cardSize.width}px;
                height: {cardSize.height}px;
                object-fit: contain;
                margin: 6px;
                background-color: {(monsterIsHovered && monsterIsHovered - 1 === i) ||
                (weaponIsHovered && weaponIsHovered - 1 === i) ||
                (potionIsHovered && potionIsHovered - 1 === i)
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'transparent'};
                border: none;
                "
            >
                <img
                    src={deckAssets.find(
                        (c) => c.suit === room[i]?.suit && c.value === room[i]?.value,
                    )?.url}
                    alt="{VALUE_TO_RANK.get(deckAssets[i]?.value)} of {deckAssets[i]?.suit}"
                    style="
                        width: 100%;
                        height: 100%;
                    "
                    onmouseenter={() => {
                        monsterIsHovered = ['spades', 'clubs'].includes(room[i].suit) ? i + 1 : 0;
                        weaponIsHovered = room[i].suit === 'diamonds' ? i + 1 : 0;
                        potionIsHovered = room[i].suit === 'hearts' ? i + 1 : 0;
                    }}
                    onmouseleave={() => {
                        monsterIsHovered = 0;
                        weaponIsHovered = 0;
                        potionIsHovered = 0;
                    }}
                /></button
            >
        {:else}
            <div
                style="
                width: {cardSize.width}px;
                height: {cardSize.height}px;
                object-fit: contain;
                margin: 6px;
                background-color: {deckIsHovered && deck[Math.max(i - deck.length, 0)]
                    ? '#0f0'
                    : '#000'};
                opacity: 0.2;
                "
            ></div>
        {/if}
    {/each}

    <!-- health -->
    {#if die}
        <div
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: 6px;
            background-color: {monsterIsHovered
                ? 'rgba(255, 0, 0, 0.2)'
                : potionIsHovered
                  ? 'rgba(0, 255, 0, 0.2)'
                  : 'transparent'};
            "
        >
            <img
                src={die.find((d) => d.value === 20)?.url}
                alt="die showing 20"
                style="
                width: 100%;
                "
            />
        </div>
    {:else}
        <!-- TODO: health logic -->
        <div
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: 6px;
            background-color: #000;
            opacity: 0.2;
            "
        >
            20
        </div>
    {/if}

    <!-- weapon -->
    <div
        style="
        width: {cardSize.width}px;
        height: {cardSize.height}px;
        object-fit: contain;
        margin: 6px;
        background-color: {weaponIsHovered ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
        "
    >
        {#if weapon}
            <img
                src={deckAssets.find((c) => c.value === weapon && c.suit === 'diamonds')?.url}
                alt="{weapon} of diamonds"
                style="
                width: 100%;
                height: 100%;
                "
            />
        {/if}
    </div>

    <!-- enemies fought with the weapon -->
    {#each [0, 1, 2, 3, 4, 5] as i}
        <div
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: 6px;
            "
        >
            {#if enemies[i]}
                <div
                    class="image-container"
                    style="
                    height: 100%; 
                    width: 100%;
                    "
                >
                    <img
                        src={deckAssets.find((c) => c.id === enemies[i]?.id)?.url}
                        alt="{VALUE_TO_RANK.get(enemies[i]?.value)} of {enemies[i]?.suit}"
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
                </div>
            {:else}
                <div
                    style="
                    width: {cardSize.width}px;
                    height: {cardSize.height}px;
                    background-color: #000;
                    opacity: 0.2;
                    "
                ></div>
            {/if}
        </div>
    {/each}
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
        /* margin: 1rem auto; */
        box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.4);
        /* align-items: center; */
    }

    .error-container {
        position: relative;
        overflow: visible;
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
    }
</style>
