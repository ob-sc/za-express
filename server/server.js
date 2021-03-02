import app from './app';
import http from 'http';
import { PORT } from './config';

const debug = require('debug')('za-express:server');

const port = PORT === undefined || Number.isNaN(PORT) ? 3000 : PORT;
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      throw new Error(`Port ${port} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`Port ${port} is already in use`);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  debug(`Listening on port ${addr.port}`);
}
