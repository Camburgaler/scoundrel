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

    let deck: { suit: CardSuit; value: number }[] = $state([...INITIAL_DECK_CONTENTS]);
    let errorSymbols: string[] = $state([]);

    let tableE1: HTMLDivElement;
    let deckAssets: AssetRow[] = $state([]);
    let cardBack: AssetRow | undefined = $state();
    let die: AssetRow[] = $state([]);
    let weapon: number = $state(0);
    let enemies: AssetRow[] = $state([]);
    let cardSize = $state({ width: 100, height: 145 });
    let room: Card[] = $state([]);

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

        resize.observe(tableE1);

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
            const index = Math.floor(Math.random() * deck.length);
            room.push(deck[index]);
        }
    }
</script>

<div bind:this={tableE1} class="table-area">
    <!-- deck -->
    <button
        style="
            width: {cardSize.width}px; 
            height: {cardSize.height}px; 
            object-fit: contain; 
            margin: 6px;
            background-color: transparent;
            border: none;
        "
        onclick={() => {
            if (deck.length === 0) {
                triggerError();
            }
            getRoom();
        }}
    >
        <div class="error-container">
            {#each errorSymbols as id (id)}
                <ErrorSymbol />
            {/each}
        </div>
        {#if deck && deck.length > 0}
            <img
                src={cardBack?.url}
                alt="card back"
                style="
                    width: 100%;
                    height: 100%;
                "
            />
        {/if}
    </button>
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
            <img
                src={deckAssets[i]?.url}
                alt="{VALUE_TO_RANK.get(deckAssets[i]?.value)} of {deckAssets[i]?.suit}"
                style="
                width: {cardSize.width}px;
                height: {cardSize.height}px;
                object-fit: contain;
                margin: 6px;
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
    {/each}
    <!-- health -->
    {#if die}
        <img
            src={die.find((d) => d.value === 20)?.url}
            alt="die showing 20"
            style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: 6px;
        "
        />
    {:else}
        <!-- TODO: health -->
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
                <img
                    src={deckAssets.find((c) => c.id === enemies[i]?.id)?.url}
                    alt="{VALUE_TO_RANK.get(enemies[i]?.value)} of {enemies[i]?.suit}"
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
</style>
