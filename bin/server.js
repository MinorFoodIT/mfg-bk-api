#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('http:api');
var http = require('http');
var logger = require('./../common/logging/winston')(__filename);

//var cacheMongod = require('../cache-mongo'); //init cache created and mongoose connection loaded
var database = require('./../common/database/auth-db');
database.createUsersTable(() => {});
// sdkCache
var sdkCache = require('./../common/sdkCache');
var nodeCache = require('./../common/nodeCache');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

sdkCache.then(started =>{
  logger.info('[Cache] statistics');
  logger.info(JSON.stringify(nodeCache.getStats()));
  logger.info('- - - - - - - - - -');
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    nodeCache.close();
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      nodeCache.close();
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      nodeCache.close();
      process.exit(1);
      break;
    default:
      nodeCache.close();
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  logger.info('[Server] started '+new Date());
}


