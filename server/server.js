import fs from 'fs';
import http from 'http';
import https from 'https';
import { PORT } from './config';
import app from './app';

const debug = require('debug')('za-express:server');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) debug('devmode');

const port = PORT === undefined || Number.isNaN(PORT) ? 3000 : PORT;
app.set('port', port);

// const server = http.createServer(app);

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

function onError(error) {
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
  const addr = server.address();
  debug(`Hört auf port ${addr.port}`);
}
