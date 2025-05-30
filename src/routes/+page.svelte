<script lang="ts">
    import {
        ADRIAN_KENNARD_RED,
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

    // States
    let selectedTable = $state(KALPONIC_STUDIO_PLANKS_LIGHT);
    let selectedBack = $state(ADRIAN_KENNARD_RED);
    let selectedDeck = $state(BYRON_KNOLL);
    let selectedDie = $state(PAINRATIO_EMERALD);

    // Assets
    let tableAsset: AssetRow | undefined = $state(undefined);
    let cardBackAsset: AssetRow | undefined = $state(undefined);
    let deckAssets: AssetRow[] = $state([]);
    let dieAssets: AssetRow[] = $state([]);

    async function loadTableAsset() {
        tableAsset = await getAssetsWithLocalCache(
            ASSETS_TABLE + selectedTable.replace(' ', '%20'),
        );
    }

    async function loadBackAsset() {
        cardBackAsset = await getAssetsWithLocalCache(
            ASSETS_BACK + selectedBack.replace(' ', '%20'),
        );
    }

    async function loadDeckAsset() {
        deckAssets = await getAssetsWithLocalCache(ASSETS_DECK + selectedDeck.replace(' ', '%20'));
    }

    async function loadDieAsset() {
        dieAssets = await getAssetsWithLocalCache(ASSETS_DIE + selectedDie.replace(' ', '%20'));
    }

    async function loadData() {
        loadTableAsset();
        loadBackAsset();
        loadDeckAsset();
        loadDieAsset();
    }

    onMount(() => {
        loadData();
    });
</script>

<div
    class="page-wrapper"
    style={`background-image: url(${tableAsset ? tableAsset.url : ''});
            background-repeat: repeat;
            background-size: auto;`}
>
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

    <CardTable {deckAssets} {cardBackAsset} {dieAssets} />
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
</style>
