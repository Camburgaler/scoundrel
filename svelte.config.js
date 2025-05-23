import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess({ script: true }),

    kit: {
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: adapter({
            config: './wrangler.jsonc',
            platformProxy: {
                configPath: undefined,
                environment: undefined,
                persist: undefined,
            },
            fallback: 'plaintext',
            routes: {
                include: ['/*'],
                exclude: ['<all>'],
            },
        }),
    },
};

export default config;
