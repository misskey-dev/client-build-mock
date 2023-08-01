import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const isTest = process.env.VITEST;
const viteBase = '/assets/';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort = process.env.HMR_PORT || 5173,
) {
  const fastify = Fastify({
    logger: true,
  });
  
  if (!isProd) {
    const vite = await (await import('vite')).createServer({
      base: viteBase,
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    });

    await fastify.register((await import('@fastify/middie')).default);
    fastify.use(vite.middlewares);

    fastify.get('*', async (req, reply) => {
      try {
        const url = req.originalUrl.replace(viteBase, '/');
        const template = await vite.transformIndexHtml(url, readFileSync(join(root, 'index.html'), 'utf-8'));
        const render = (await vite.ssrLoadModule('/src/entry-server.ts')).render;

        const { html } = await render({
          path: url,
          message: `THIS IS DEVELOPMENT SERVER: ${url}`,
        });

        reply.status(200).header('Content-Type', 'text/html').send(`<!DOCTYPE html>${html}`);
      } catch (e) {
        vite && vite.ssrFixStacktrace(e);
        console.log(e.stack);
        reply.status(500).send(e.stack);
      }
    });
  } else {
    fastify.register(fastifyStatic, {
      root: join(_dirname, 'built/client'),
      prefix: viteBase,
      decorateReply: false,
    });

    const template = readFileSync(join(_dirname, 'built/client/index.html'), 'utf-8');
    const manifest = JSON.parse(readFileSync(join(_dirname, 'built/client/ssr-manifest.json'), 'utf-8'));
    const clientManifest = JSON.parse(readFileSync(join(_dirname, 'built/client/manifest.json'), 'utf-8'));
    const renderProd = (await import(join(_dirname, 'built/server/entry-server.js'))).renderProd;

    fastify.get('*', async (req, reply) => {
      try {
        const url = req.originalUrl.replace(viteBase, '/');
        const { html } = await renderProd(url, viteBase, {
          path: url,
          message: `THIS IS PRODUCTION SERVER: ${url}`,
        }, manifest, clientManifest);

        reply.status(200).header('Content-Type', 'text/html').send(`<!DOCTYPE html>${html}`);
      } catch (e) {
        vite && vite.ssrFixStacktrace(e);
        console.log(e.stack);
        reply.status(500).send(e.stack);
      }
    });
  }

  return fastify;
}

createServer().then(fastify => fastify.listen({ port: 3000, host: '0.0.0.0' }));
