<script lang="ts">
    import {
        ABJIKLAM,
        ASSETS_BACK,
        ASSETS_DECK,
        ASSETS_DIE,
        ASSETS_TABLE,
        BYRON_KNOLL,
        KALPONIC_STUDIO_PLANKS_LIGHT,
        PAINRATIO_EMERALD,
    } from '$lib/constants';
    import type { AssetRow } from '$lib/interfaces/assets';
    import { getAssetsWithLocalCache } from '$lib/utils/cache';
    import { onMount } from 'svelte';
    import CardTable from './CardTable.svelte';

    // Assets
    let tableAsset: AssetRow | undefined = $state(undefined);
    let tableNames: string[] = $state([]);
    let backAsset: AssetRow | undefined = $state(undefined);
    let backNames: string[] = $state([]);
    let deckAssets: AssetRow[] = $state([]);
    let deckNames: string[] = $state([]);
    let dieAssets: AssetRow[] = $state([]);
    let dieNames: string[] = $state([]);

    // States
    let showTray = $state(false);
    let selectedTable = $state(KALPONIC_STUDIO_PLANKS_LIGHT);
    let selectedBack = $state(ABJIKLAM);
    let selectedDeck = $state(BYRON_KNOLL);
    let selectedDie = $state(PAINRATIO_EMERALD);

    async function loadTableAsset() {
        tableAsset = await getAssetsWithLocalCache(
            ASSETS_TABLE + selectedTable.replace(' ', '%20'),
        );
    }

    async function loadBackAsset() {
        backAsset = await getAssetsWithLocalCache(ASSETS_BACK + selectedBack.replace(' ', '%20'));
    }

    async function loadDeckAsset() {
        deckAssets = await getAssetsWithLocalCache(ASSETS_DECK + selectedDeck.replace(' ', '%20'));
    }

    async function loadDieAsset() {
        dieAssets = await getAssetsWithLocalCache(ASSETS_DIE + selectedDie.replace(' ', '%20'));
    }

    async function loadData() {
        tableNames = (await getAssetsWithLocalCache(ASSETS_TABLE)).sort();
        backNames = (await getAssetsWithLocalCache(ASSETS_BACK)).sort();
        deckNames = (await getAssetsWithLocalCache(ASSETS_DECK)).sort();
        dieNames = (await getAssetsWithLocalCache(ASSETS_DIE)).sort();

        loadTableAsset();
        loadBackAsset();
        loadDeckAsset();
        loadDieAsset();
    }

    onMount(() => {
        loadData();
    });

    $effect(() => {
        if (selectedTable) {
            loadTableAsset();
        }
        if (selectedBack) {
            loadBackAsset();
        }
        if (selectedDeck) {
            loadDeckAsset();
        }
        if (selectedDie) {
            loadDieAsset();
        }
    });
</script>

<div
    class="page-wrapper"
    style={`background-image: url(${tableAsset ? tableAsset.url : ''});
            background-repeat: repeat;
            background-size: auto;`}
>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="hamburger"
        onclick={() => {
            showTray = !showTray;
        }}
    >
        <div></div>
        <div></div>
        <div></div>
    </button>
    <div class="tray" class:open={showTray}>
        <div class="tray-header">
            <h2>SETTINGS</h2>
        </div>
        <div>
            <label for="table">Table: </label>
            <select name="table" id="table" bind:value={selectedTable}>
                {#each tableNames as tableName}
                    <option value={tableName}>
                        {tableName}
                    </option>
                {/each}
            </select>
        </div>
        <hr />
        <div>
            <label for="back">Card Back: </label>
            <select name="back" id="back" bind:value={selectedBack}>
                {#each backNames as backName}
                    <option value={backName}>
                        {backName}
                    </option>
                {/each}
            </select>
        </div>
        <hr />
        <div>
            <label for="deck">Card Deck: </label>
            <select name="deck" id="deck" bind:value={selectedDeck}>
                {#each deckNames as deckName}
                    <option value={deckName}>
                        {deckName}
                    </option>
                {/each}
            </select>
        </div>
        <hr />
        <div>
            <label for="die">HP Die: </label>
            <select name="die" id="die" bind:value={selectedDie}>
                {#each dieNames as dieName}
                    <option value={dieName}>
                        {dieName}
                    </option>
                {/each}
            </select>
        </div>
    </div>
    <div
        style="
        background-color: rgba(255, 255, 255, 0.5);
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        "
    >
        <h1>SCOUNDREL</h1>
        <p>
            Inspired by <a
                href="https://www.youtube.com/watch?v=7fP-QLtWQZs&list=WL&index=2&pp=gAQBiAQB"
                >a YouTube video</a
            >
            by <a href="https://www.youtube.com/@riffleshuffleandroll">Riffle Shuffle & Roll</a>
        </p>
    </div>

    <CardTable />
</div>

<style>
    .page-wrapper {
        min-height: 100vh;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        box-sizing: border-box;
    }

    .tray {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 300px;
        background-color: #f8f8f8;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
        padding: 1rem;
        border-radius: 1rem;
    }
    .tray.open {
        transform: translateX(0);
    }

    .hamburger {
        position: fixed;
        top: 1rem;
        left: 1rem;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 1100;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .hamburger div {
        height: 4px;
        background: black;
        border-radius: 2px;
    }

    .tray-header {
        text-align: center;
        margin-bottom: 1rem; /* Optional spacing below the header */
    }
</style>
