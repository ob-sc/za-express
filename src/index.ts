/* eslint-disable no-restricted-syntax */

import fs from 'fs';
import http from 'http';
import https from 'https';
import { port } from './config';
import app from './app';
import { isDev } from './util/helper';
import debug from './util/debug';
import { testConfig } from './util/testcfg';

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error;

  switch (error.code) {
    case 'EACCES':
      throw new Error(`Port ${port} braucht höheren Zugriff`);
    case 'EADDRINUSE':
      throw new Error(`Port ${port} wird bereits verwendet`);
    default:
      throw error;
  }
}

function onListening() {
  debug(`port ${port}`);
}

const cfg = testConfig(process.env);
if (cfg.errors !== 0) debug(`Keine cfg: ${cfg.string}`);
else debug('Config geladen');

debug('Starte Server');
if (isDev) debug('devmode');
debug('node', process.version);
debug('package', process.env.npm_package_version);

app.set('port', port);

const server = isDev
  ? http.createServer(app)
  : https.createServer(
      {
        // key: fs.readFileSync('/etc/nginx/ssl/localhost-key.pem'),
        // cert: fs.readFileSync('/etc/nginx/ssl/localhost.pem'),
        key: fs.readFileSync('/etc/nginx/ssl/key.pem'),
        cert: fs.readFileSync('/etc/nginx/ssl/certificate.pem'),
      },
      app
    );

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
