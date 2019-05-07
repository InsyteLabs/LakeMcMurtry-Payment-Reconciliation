'use strict';

const express = require('express'),
      server  = express(),
      setup   = require('./setup'),
      routes  = require('./routes'),
      conf    = require('./conf');

setup(server);

// Default Route
server.get('/', (req, res, next) => {
    return res.json({ message: 'Lake McMurtry API' });
});

server.use(routes);

server.listen(conf.PORT, () => console.log(`Express server listening on ${ conf.PORT }`));