
class Player {

    constructor(game, connection) {
        this.g = game;

        this.input = {
            acceleration:  0,
            direction:     0,
            viewDirection: 0,
        };

        this._connection = connection;

        this._connection.on('message', message => {
            if (message.type !== 'utf8') {
                throw new Error(`Invalid message type [${message.type}]`);
            }

            const msg = JSON.parse(message.utf8Data);

            this._handleMessage(msg.type, msg.data);
        });
    }

    _handleMessage(type, data) {
        switch (type) {
            case 'join': {
                this.name = data.name;

                this.g.joinPlayer(this);
                break;
            }
            case 'input': {
                this.input = data;
                break;
            }
        }
    }

    send(type, data) {
        this._connection.sendUTF(JSON.stringify({
            type,
            data,
        }));
    }

    sendRaw(json) {
        this._connection.sendUTF(json);
    }

}

module.exports = Player;
