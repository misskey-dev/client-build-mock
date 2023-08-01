import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderComponent, renderToString } from "vue/server-renderer";
import { defineAsyncComponent, defineComponent, ref, onMounted, mergeProps, unref, useSSRContext, createSSRApp } from "vue";
const AppAsync = defineAsyncComponent(() => import("./App-c9b07b44.js"));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "View",
  __ssrInlineRender: true,
  props: {
    message: null,
    path: null,
    manifest: { default: () => ({}) },
    modules: null,
    clientManifest: null,
    assetsBase: { default: "/" }
  },
  setup(__props) {
    const props = __props;
    const basenameRegExp = /[^\\/]+(?=[\\/])?$/;
    const preloadLinks = props.modules ? props.modules.reduce((data, module) => {
      var _a;
      const files = props.manifest[module];
      if (files) {
        for (const file of files) {
          if (data.seen.has(file))
            continue;
          data.links.add(file);
          data.seen.add(file);
          const filename = (_a = basenameRegExp.exec(file)) == null ? void 0 : _a[0];
          if (!(filename && props.manifest[filename]))
            continue;
          for (const depFile of props.manifest[filename]) {
            data.links.add(depFile);
            data.seen.add(depFile);
          }
        }
      }
      return data;
    }, { seen: /* @__PURE__ */ new Set(), links: /* @__PURE__ */ new Set() }) : null;
    const onClient = ref(false);
    onMounted(() => {
      onClient.value = true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<html${ssrRenderAttrs(mergeProps({ lang: "en" }, _attrs))}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>TEST</title>`);
      if (__props.clientManifest) {
        _push(`<!--[-->`);
        ssrRenderList(__props.clientManifest["index.html"].css, (css) => {
          _push(`<link rel="stylesheet"${ssrRenderAttr("href", `${__props.assetsBase}${css}`)}>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(preloadLinks)) {
        _push(`<!--[-->`);
        ssrRenderList(unref(preloadLinks).links, (link) => {
          _push(`<!--[-->`);
          if (link.endsWith(".js")) {
            _push(`<link rel="modulepreload"${ssrRenderAttr("href", link)} crossorigin="crossorigin">`);
          } else if (link.endsWith(".css")) {
            _push(`<link rel="stylesheet"${ssrRenderAttr("href", link)}>`);
          } else if (link.endsWith(".woff")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="font" type="font/woff" crossorigin="anonymous">`);
          } else if (link.endsWith(".woff2")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="font" type="font/woff2" crossorigin="anonymous">`);
          } else if (link.endsWith(".gif")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="image" type="image/gif" crossorigin="anonymous">`);
          } else if (link.endsWith(".jpg") || link.endsWith(".jpeg")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="image" type="image/jpeg">`);
          } else if (link.endsWith(".png")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="image" type="image/png">`);
          } else if (link.endsWith(".svg")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="image" type="image/svg+xml">`);
          } else if (link.endsWith(".webp")) {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} as="image" type="image/webp">`);
          } else {
            _push(`<link rel="preload"${ssrRenderAttr("href", link)} crossorigin="anonymous">`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</head><body><div id="innerapp">`);
      _push(ssrRenderComponent(unref(AppAsync), null, null, _parent));
      _push(`</div>`);
      if (__props.clientManifest) {
        _push(`<script type="module" crossorigin${ssrRenderAttr("src", `${__props.assetsBase}${__props.clientManifest["index.html"].file}`)}><\/script>`);
      } else {
        _push(`<!--[--><script type="module" src="/src/entry-client.ts"><\/script><script type="module" src="/@vite/client"><\/script><!--]-->`);
      }
      _push(`</body></html>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/view/View.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const style = "";
function createApp(props) {
  const app = createSSRApp(_sfc_main, props);
  return app;
}
async function render(props) {
  const app = createApp(props);
  const ctx = {};
  const html = await renderToString(app, ctx);
  return { html, ctx };
}
const modulesMap = /* @__PURE__ */ new Map();
async function renderProd(props, assetsBase, manifest, clientManifest) {
  const modules = await (async () => {
    const modulesKey = `${JSON.stringify(props)}`;
    const modules2 = modulesMap.get(modulesKey);
    if (modules2) {
      return modules2;
    }
    const app2 = createApp(props);
    const ctx2 = {};
    await renderToString(app2, ctx2);
    if (ctx2.modules) {
      modulesMap.set(modulesKey, ctx2.modules);
    }
    return ctx2.modules;
  })();
  const app = createApp({ modules: Array.from(modules), manifest, clientManifest, assetsBase, ...props });
  const ctx = {};
  const html = await renderToString(app, ctx);
  return { html, ctx };
}
export {
  createApp,
  render,
  renderProd
};
