<script lang="ts">
    import {
        ABJIKLAM,
        ASSETS_BACK,
        ASSETS_DECK,
        ASSETS_DIE,
        BYRON_KNOLL,
        PAINRATIO_EMERALD,
        VALUE_TO_RANK
    } from '$lib/constants';
    import type { AssetRow } from '$lib/types/assets';
    import { onMount } from 'svelte';

    let tableE1: HTMLDivElement;
    let cardSize = { width: 100, height: 145 };
    let deck: AssetRow[] = [];
    let cardBack: AssetRow;
    let die: AssetRow[] = [];
    let weapon: number = 0;
    let enemies: AssetRow[] = [];

    async function loadData() {
        const deck_response = await fetch(ASSETS_DECK + BYRON_KNOLL.replace(' ', '%20'));
        deck = await deck_response.json();

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
</script>

<div bind:this={tableE1} class="table-area">
    <img
        src={cardBack?.url + '?cb=' + Math.random()}
        alt="card back"
        style="
            width: {cardSize.width}px; 
            height: {cardSize.height}px; 
            object-fit: contain; 
            margin: 6px;
        "
    />
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
    {#each [0, 1, 2, 3] as i}
        <img
            src={deck[i]?.url + '?cb=' + Math.random()}
            alt="{VALUE_TO_RANK.get(deck[i]?.value)} of {deck[i]?.suit}"
            style="
                width: {cardSize.width}px;
                height: {cardSize.height}px;
                object-fit: contain;
                margin: 6px;
                "
        />
    {/each}
    <img
        src={die.find((d) => d.value === 20)?.url + '?cb=' + Math.random()}
        alt="die showing 20"
        style="
            width: {cardSize.width}px;
            height: {cardSize.height}px;
            object-fit: contain;
            margin: 6px;
        "
    />
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
                src={deck.find((c) => c.value === weapon && c.suit === 'diamonds')?.url +
                    '?cb=' +
                    Math.random()}
                alt="{weapon} of diamonds"
                style="
                width: 100%;
                height: 100%;
            "
            />
        {:else}
            <button on:click={() => (weapon = Math.floor(Math.random() * 9) + 2)}
                >Roll weapon</button
            >
        {/if}
    </div>
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
                    src={deck.find((c) => c.id === enemies[i]?.id)?.url + '?cb=' + Math.random()}
                    alt="{VALUE_TO_RANK.get(enemies[i]?.value)} of {enemies[i]?.suit}"
                    style="
                width: 100%;
                height: 100%;
            "
                />
            {:else}
                <button
                    on:click={() =>
                        (enemies[i] = deck.find(
                            (c) =>
                                (c.suit == 'spades' || c.suit == 'clubs') &&
                                c.value === Math.floor(Math.random() * 13) + 1
                        ))}>Roll enemy {i + 1}</button
                >
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
</style>
