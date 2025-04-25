<script lang="ts">
    import CardTable from './CardTable.svelte';
</script>

<div class="page-wrapper">
    <h1>SCOUNDREL</h1>
    <p>
        Inspired by <a
            href="https://www.youtube.com/watch?v=7fP-QLtWQZs&list=WL&index=2&pp=gAQBiAQB"
            >a YouTube video</a
        >
        by <a href="https://www.youtube.com/@riffleshuffleandroll">Riffle Shuffle & Roll</a>
    </p>

    <CardTable />
</div>

<style>
    .page-wrapper {
        max-height: 100vh;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        box-sizing: border-box;
    }
</style>
