<!-- ErrorSymbol.svelte -->
<script>
    import { ERROR_ANIMATION_DURATION } from './constants';

    export let duration = ERROR_ANIMATION_DURATION;
    export let icon = '❌';
</script>

<div
    class="error-symbol"
    style="
    --float-duration: {duration}ms;
  "
>
    {icon}
</div>

<style>
    .error-symbol {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2rem;
        animation:
            fadeInAndOut var(--float-duration) ease-in,
            float var(--float-duration) linear;
    }

    @keyframes fadeInAndOut {
        0% {
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes float {
        from {
            transform: translateX(-50%) translateY(0);
        }
        to {
            transform: translateX(-50%) translateY(-100px);
        }
    }
</style>
