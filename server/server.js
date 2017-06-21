const http = require('http');
const WebSocketServer = require('websocket').server;

const Game   = require('./Game');
const Player = require('./Player');
const Tank   = require('./Tank');

let game;

const server = http.createServer();
server.listen(9000, err => {
    if (err) {
        throw new Error('Listen failed:', err);
    }

    game = new Game();
    game.start();

    console.log('Server started at 9000 port');
});

const wsServer = new WebSocketServer({
    httpServer:            server,
    autoAcceptConnections: true,
});

wsServer.on('connect', conn => {
    new Player(game, conn);
});
