import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
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

fastify.listen({ port: 3000, host: '0.0.0.0' });
