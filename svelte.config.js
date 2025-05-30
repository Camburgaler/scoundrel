import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess({ script: true }),

    kit: {
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: vercel(),
    },
};

export default config;
