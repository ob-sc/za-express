/* eslint-disable no-restricted-syntax */

import fs from 'fs';
import http from 'http';
import https from 'https';
import { port } from './config';
import app from './app';
import { isDev } from './util/helper';
import debug from './util/debug';
import { validateCfg } from './util/validateCfg';

function onError(error: NodeJS.ErrnoException) {
  try {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
      case 'EACCES':
        throw new Error(`Port ${port} benötigt root`);
      case 'EADDRINUSE':
        throw new Error(`Port ${port} wird bereits verwendet`);
      default:
        throw error;
    }
  } catch (err) {
    debug(err);
  }
}

function onListening() {
  debug(`port ${port}`);
}

const cfg = validateCfg(process.env);

debug('server version', process.env.npm_package_version);
if (cfg.errors !== 0) debug(`keine cfg: ${cfg.string}`);
else debug('config geladen');
debug('node', process.version);
debug('env', process.env.NODE_ENV ?? 'keine NODE_ENV');

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
