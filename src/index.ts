import fs from 'fs';
import http from 'http';
import https from 'https';
import { port } from './config';
import app from './app';
import { isDev } from './util/helper';
import debug from './util/debug';

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
  // eslint-disable-next-line
  debug(`port ${port}`);
}

// eslint-disable-next-line
if (isDev) debug('devmode');

// eslint-disable-next-line
debug('node', process.version);

// eslint-disable-next-line
debug('package', process.env.npm_package_version);

app.set('port', port);

const server = isDev
  ? http.createServer(app)
  : https.createServer(
      {
        key: fs.readFileSync('/etc/nginx/ssl/key.pem'),
        cert: fs.readFileSync('/etc/nginx/ssl/certificate.pem'),
      },
      app
    );

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
