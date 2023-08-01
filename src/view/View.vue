<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppAsync from '../AppAsync';

type Props = {
    message?: string;
    path: string;
    manifest?: Record<string, any>;
    modules: string[];
    clientManifest?: Record<string, any>;
    assetsBase?: string;
};

const props = withDefaults(defineProps<Props>(), {
    manifest: () => ({} as Record<string, any>),
    assetsBase: '/',
});

const basenameRegExp = /[^\\/]+(?=[\\/])?$/;

// renderPreloadLinks
// https://github.com/vitejs/vite-plugin-vue/blob/1e8d16ecbdc33c21a038948c2dd9ac7791df1508/playground/ssr-vue/src/entry-server.js
const preloadLinks = props.modules ? props.modules.reduce((data, module) => {
    const files = props.manifest[module];
    if (files) {
        for (const file of files) {
            if (data.seen.has(file)) continue;
            data.links.add(file);
            data.seen.add(file);
            const filename = basenameRegExp.exec(file)?.[0];
            if (!(filename && props.manifest[filename])) continue;
            for (const depFile of props.manifest[filename]) {
                data.links.add(depFile);
                data.seen.add(depFile);
            }
        }
    }
    return data;
}, { seen: new Set<string>(), links: new Set<string>() }) : null;


const onClient = ref(false);
onMounted(() => {
    onClient.value = true;
});
</script>

<template>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TEST</title>

    <template v-if="clientManifest" v-for="css in clientManifest['index.html'].css">
        <link rel="stylesheet" :href="`${assetsBase}${css}`">
    </template>

    <template v-if="preloadLinks" v-for="link in preloadLinks.links"  :key="link">
        <link v-if="link.endsWith('.js')" rel="modulepreload" :href="link" crossorigin="crossorigin">
        <link v-else-if="link.endsWith('.css')" rel="stylesheet" :href="link">
        <link v-else-if="link.endsWith('.woff')" rel="preload" :href="link" as="font" type="font/woff" crossorigin="anonymous">
        <link v-else-if="link.endsWith('.woff2')" rel="preload" :href="link" as="font" type="font/woff2" crossorigin="anonymous">
        <link v-else-if="link.endsWith('.gif')" rel="preload" :href="link" as="image" type="image/gif" crossorigin="anonymous">
        <link v-else-if="link.endsWith('.jpg') || link.endsWith('.jpeg')" rel="preload" :href="link" as="image" type="image/jpeg">
        <link v-else-if="link.endsWith('.png')" rel="preload" :href="link" as="image" type="image/png">
        <link v-else-if="link.endsWith('.svg')" rel="preload" :href="link" as="image" type="image/svg+xml">
        <link v-else-if="link.endsWith('.webp')" rel="preload" :href="link" as="image" type="image/webp">
        <link v-else rel="preload" :href="link" crossorigin="anonymous">
    </template>
</head>
<body>
    <div id="innerapp">
        <AppAsync />
    </div>
    <script v-if="clientManifest" type="module" crossorigin :src="`${assetsBase}${clientManifest['index.html'].file}`"></script>
    <template v-else>
        <script type="module" src="/src/entry-client.ts"></script>
        <script type="module" src="/@vite/client"></script>
    </template>
</body>
</html>
</template>
