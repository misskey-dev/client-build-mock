import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyProxy from '@fastify/http-proxy';
import pug from 'pug';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyView, {
  root: join(_dirname, 'views'),
  engine: {
    pug: pug,
  },
  defaultContext: {
  },
});

if (process.env.NODE_ENV !== 'production') {
  fastify.register(fastifyProxy, {
    upstream: 'http://127.0.0.1:5173',
    prefix: '/assets',
    rewritePrefix: '/assets',
  });
  fastify.get('*', async (request, reply) => {
    return reply.view('index', {
      clientEntry: {
        file: 'src/main.ts',
      },
    });
  });

} else {
  fastify.register(fastifyStatic, {
    root: join(_dirname, 'built'),
    prefix: '/assets/',
    decorateReply: false,
  });

  fastify.get('*', async (request, reply) => {
    const clientManifest = JSON.parse(readFileSync('./built/manifest.json', 'utf-8'));
    const clientEntry = clientManifest['src/main.ts'];

    return reply.view('index', {
      clientEntry,
    });
  });
}

fastify.listen({ port: 3000, host: '0.0.0.0' });
