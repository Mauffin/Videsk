const express = require('express');
const server = express();
server.set('trust proxy', true);
server.use('/', express.static(__dirname + '/public'));
server.listen(8438);
console.log('Live server http://localhost:8438');
