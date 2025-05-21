<script lang="ts">
    import { ASSETS_TABLE, KALPONIC_STUDIO_PLANKS_LIGHT } from '$lib/constants';
    import type { AssetRow } from '$lib/interfaces/assets';
    import { onMount } from 'svelte';
    import CardTable from './CardTable.svelte';

    // Assets
    let tableAssets: AssetRow[] = $state([]);

    async function loadData() {
        const table_response = await fetch(
            ASSETS_TABLE + KALPONIC_STUDIO_PLANKS_LIGHT.replace(' ', '%20'),
        );
        tableAssets = await table_response.json();
    }

    onMount(() => {
        loadData();
    });
</script>

<div
    class="page-wrapper"
    style={`background-image: url(${tableAssets.length > 0 ? tableAssets[0].url : ''});
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
</style>
