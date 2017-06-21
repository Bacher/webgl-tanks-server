const Tank = require('./Tank');

class Game {

    constructor() {
        this._players = [];
        this._tanks   = [];
        this._ids     = new Set();

        this._time = 0;
        this._lastTs = null;
    }

    start() {
        if (this._time > 0) {
            throw new Error('Already started');
        }

        setInterval(() => {
            const now = Date.now();
            const delta = this._lastTs ? now - this._lastTs : 0;
            this._time += delta;
            this._tick(delta);
            this._lastTs = now;
        }, 1000 / 300);
    }

    joinPlayer(player) {
        this._players.push(player);

        const tankId = this._generateId();

        const tank = new Tank(tankId);

        this._tanks.push({
            player,
            tank,
        });

        tank.position = this._generateRandomPosition();
        tank.rotation = Math.random() * Math.PI * 2;

        player.send('tank', {
            id: tankId,
        });
    }

    _generateRandomPosition() {
        return {
            x: 200 * Math.random() - 100,
            y: 200 * Math.random() - 100,
        };
    }

    _generateId() {
        let id;

        do {
            id = String(Math.random()).substr(2, 8);
        } while (this._ids.has(id));

        this._ids.add(id);

        return id;
    }

    _tick(delta) {
        const tanks = [];

        for (let { tank, player } of this._tanks) {
            // TODO LOGIC

            tanks.push({
                id:   tank.id,
                name: player.name,
                pos:  tank.position,
            });
        }

        const worldState = {
            tanks,
            time: this._time,
        };

        const json = JSON.stringify({
            type: 'world',
            data: worldState,
        });

        for (let player of this._players) {
            player.sendRaw(json);
        }
    }

}

module.exports = Game;
