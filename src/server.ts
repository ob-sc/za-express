import fs from 'fs';
import http from 'http';
import https from 'https';
import { PORT } from './config';
import app from './app';
import { isDev } from './util/helper';
import debug from './util/debug';

if (isDev) debug('devmode');

app.set('port', PORT);

const server = isDev
  ? http.createServer(app)
  : https.createServer(
      {
        key: fs.readFileSync('/etc/nginx/ssl/key.pem'),
        cert: fs.readFileSync('/etc/nginx/ssl/certificate.pem'),
      },
      app
    );

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error;

  switch (error.code) {
    case 'EACCES':
      throw new Error(`Port ${PORT} braucht höheren Zugriff`);
    case 'EADDRINUSE':
      throw new Error(`Port ${PORT} wird bereits verwendet`);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  debug(`Hört auf port ${addr}`);
}
