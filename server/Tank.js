const MAX_SELF_SPEED = 10;

const PI2 = Math.PI * 2;

class Tank {

    constructor(id) {
        this.id = id;

        this.position = {
            x: 0,
            y: 0,
        };

        this.direction       = 0;
        this.turretDirection = 0;
        this._speed          = 0;
        this._acceleration   = 0;
    }

    applyTickChanges(delta, input) {
        const { acceleration, direction, viewDirection } = input;

        this._acceleration += acceleration * delta * 0.000625;

        const dir = this._speed >= 0 ? 1 : -1;

        this.direction -= dir * direction * delta * 0.0007;

        if (
            Number.isNaN(this._speed) ||
            Number.isNaN(this._acceleration) ||
            Number.isNaN(this.direction)
        ) {
            console.log('Tank: something is NaN');
            return;
        }

        if (delta !== 0) {
            if (Math.abs(this._acceleration) > 0.0001) {
                this._acceleration *= Math.pow(0.95, delta * 0.0625);
            }

            this._speed *= Math.pow(0.8, delta);

            if (this._speed > 0) {
                this._speed -= 0.1;

                if (this._speed < 0) {
                    this._speed = 0;
                }
            } else {
                this._speed += 0.1;

                if (this._speed > 0) {
                    this._speed = 0;
                }
            }
        }

        let speedChange;

        if (this._acceleration < -0.001 || this._acceleration > 0.001) {
            speedChange = this._acceleration;

            if (this._speed > 0 && this._acceleration > 0 || this._speed < 0 && this._acceleration < 0) {
                speedChange *= (MAX_SELF_SPEED - this._speed) / MAX_SELF_SPEED;
            }

            this._speed += speedChange;
        }

        const distance = this._speed * delta * 0.0625;

        const sin = Math.sin(-this.direction);
        const cos = Math.cos(-this.direction);

        this.position.y -= distance * cos;
        this.position.x += distance * sin;

        // Turret

        const _delta = delta * 0.0008;

        const needAngle  = viewDirection - this.direction;
        const deltaAngle = normalizeAngle(this.turretDirection - needAngle);

        if (deltaAngle < _delta || deltaAngle > PI2 - _delta) {
            this.turretDirection = needAngle
        } else {
            if (deltaAngle > Math.PI) {
                this.turretDirection += _delta;
            } else {
                this.turretDirection -= _delta;
            }
        }
    }

}

function normalizeAngle(angle) {
    let _angle = angle;

    if (_angle < 0) {
        return _angle - Math.floor(_angle / PI2) * PI2;
    } else {
        if (_angle < PI2) {
            return _angle
        } else {
            return _angle % PI2;
        }
    }
}

module.exports = Tank;
