class Game {
    constructor() {
        this.hero = new Hero(this);
        this.ui = new UI();
        this.waves = [];
        this.bullets = [];

        this.init();
    }

    init() {
        this.hero.setTracking(true);
        this.ui.updateAmmo(this.hero.ammo);
        this.ui.updateScore(0);

        $(document).on('keydown', (e) => this.hero.doAction(e, this.ui));
        $(document).on('mousedown', (e) => this.hero.shoot(e, this.ui));
        $(document).on('mouseup', () => this.hero.stopShooting());

        setInterval(() => this.createWave(), 4000);

        this.gameLoop();
    }

    createWave() {
        const wave = new Wave();
        this.waves.push(wave);
        wave.spawnWave();
    }

    gameLoop() {
        setInterval(() => {
            this.waves.forEach(wave => wave.update());

            this.bullets.forEach(bullet => bullet.update());

            this.checkCollisions();

            this.cleanUp();

        }, 10);
    }

    checkCollisions() {
        for (let wave of this.waves) {
            for (let entity of wave.entities) {
                for (let bullet of this.bullets) {
                    if (this.isColliding(bullet, entity)) {
                        entity.health -= bullet.damage;
                        bullet.active = false;

                        if (entity.health <= 0) {
                            entity.active = false;
                            this.hero.score += 10;
                            this.ui.updateScore(this.hero.score);
                        }

                        break;
                    }
                }
            }
        }
    }

    isColliding(bullet, entity) {
        if (!bullet.active || !entity.active) return false;

        const bOffset = bullet.element.offset();
        const eOffset = entity.element.offset();
        const bWidth = bullet.element.outerWidth();
        const bHeight = bullet.element.outerHeight();
        const eWidth = entity.element.outerWidth();
        const eHeight = entity.element.outerHeight();

        return !(
            ((bOffset.top + bHeight) < (eOffset.top)) ||
            (bOffset.top > (eOffset.top + eHeight)) ||
            ((bOffset.left + bWidth) < eOffset.left) ||
            (bOffset.left > (eOffset.left + eWidth))
        );
    }

    cleanUp() {
        this.bullets = this.bullets.filter(bullet => {
            if (!bullet.active) {
                bullet.remove();
                return false;
            }
            return true;
        });

        this.waves.forEach(wave => {
            wave.entities = wave.entities.filter(entity => {
                if (!entity.active) {
                    entity.remove();
                    return false;
                }
                return true;
            });
        });
    }
}

class Wave {
    constructor() {
        this.entities = [];
    }

    spawnWave() {
        const paths = ['#path-1', '#path-2'];
        let wallSpawned = false;

        paths.forEach(path => {
            let entityType = Math.random() > 0.5 ? 'enemy' : 'wall';

            if (entityType === 'wall' && wallSpawned) {
                entityType = 'enemy';
            }

            if (entityType === 'wall') {
                wallSpawned = true;
                const wall = new Wall();
                $(path).append(wall.element);
                this.entities.push(wall);
            } else {
                const enemy = new Enemy();
                $(path).append(enemy.element);
                this.entities.push(enemy);
            }
        });
    }

    update() {
        this.entities.forEach(entity => {
            entity.move();
        });
    }
}

class Hero {
    constructor(game) {
        this.game = game;
        this.element = $('#hero');
        this.ammo = 10;
        this.score = 0;
        this.tracking = true;
        this.shootInterval = null;
        this.currentLane = 1;
        this.updatePosition();
    }

    doAction(event, ui) {
        event.preventDefault();

        if (event.key === ' ') {
            this.fireBullet(ui);
        } else if (event.key === 'ArrowLeft') {
            this.currentLane = 1;
        } else if (event.key === 'ArrowRight') {
            this.currentLane = 2;
        } 
        this.updatePosition();
    }

    updatePosition() {
        const lanePositions = {
            1: $('#path-1').position().left + ($('#path-1').width() / 2) - (this.element.width() / 2),
            2: $('#path-2').position().left + ($('#path-2').width() / 2) - (this.element.width() / 2)
        };
        this.element.css('left', lanePositions[this.currentLane] + 'px');
    }

    fireBullet(ui) {
        if (this.ammo > 0) {
            const bulletX = this.element.offset().left + (this.element.width() / 2);
            const bulletY = this.element.offset().top; 

            this.game.bullets.push(new Bullet(bulletX, bulletY));

            this.ammo--;
            ui.updateAmmo(this.ammo);
        }
    }

    setTracking(value) {
        this.tracking = value;
    }
}

class Bullet {
    constructor(x, y) {
        this.element = $('<div class="bullet"></div>');
        this.damage = 1;
        this.active = true;
        this.speed = 5;

        this.x = x;
        this.y = y;

        $('#fired-bullets').append(this.element);
        this.element.css({
            left: `${this.x}px`,
            top: `${this.y}px`
        });
    }

    update() {
        this.y -= this.speed;
        this.element.css('top', `${this.y}px`);

        if (this.y < 0) {
            this.active = false;
        }
    }

    remove() {
        this.element.remove();
    }
}

class Enemy {
    constructor() {
        this.element = $('<div class="enemy"></div>');
        this.y = 0;
        this.health = 2;
        this.active = true;
        this.speed = 1;

        $('#enemies').append(this.element);
    }

    move() {
        this.y += this.speed;
        this.element.css('top', this.y + 'px');
    }

    remove() {
        this.element.remove();
    }
}

class Wall {
    constructor() {
        this.element = $('<div class="wall"></div>');
        this.y = 0;
        this.health = 10;
        this.active = true;
        this.speed = 1;

        $('#walls').append(this.element);
    }

    move() {
        this.y += this.speed;
        this.element.css('top', this.y + 'px');
    }

    remove() {
        this.element.remove();
    }
}

class UI {
    updateAmmo(count) {
        $('#ammo .value').text(count);
    }

    updateScore(score) {
        $('#score .value').text(score);
    }
}

$(document).ready(() => {
    new Game();
});