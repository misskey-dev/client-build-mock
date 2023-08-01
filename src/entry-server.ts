import { SSRContext, renderToString } from 'vue/server-renderer';
import { createSSRApp } from 'vue';
import View from './view/View.vue';
import './style.css';

export function createApp(props?: any) {
  const app = createSSRApp(View, props);
  return app;
}

export async function render(props?: any) {
    const app = createApp(props);
    const ctx = {} as SSRContext;
    const html = await renderToString(app, ctx);
    return { html, ctx };
}

const modulesMap = new Map<string, Set<string>>();

export async function renderProd(props: any, assetsBase: string, manifest: any, clientManifest: any) {
    const modules = await (async () => {
        const modulesKey = `${JSON.stringify(props)}`
        const modules = modulesMap.get(modulesKey);
        if (modules) {
            return modules;
        }
        // modulesを取得したいためレンダリングを二度漬けする
        const app = createApp(props);
        const ctx = {} as SSRContext;
        await renderToString(app, ctx);
        if (ctx.modules) {
            modulesMap.set(modulesKey, ctx.modules);
        }
        return ctx.modules;
    })();
    const app = createApp({ modules: Array.from(modules), manifest, clientManifest, assetsBase, ...props });
    const ctx = {} as SSRContext;
    const html = await renderToString(app, ctx);
    return { html, ctx };
}
