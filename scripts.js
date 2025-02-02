class Game {
    constructor() {
        this.hero = new Hero();
        this.ui = new UI();
        this.waves = [];
        
        this.init();
    }

    init() {
        this.hero.setTracking(true);
        this.ui.updateAmmo(this.hero.ammo);
        this.ui.updateScore(this.hero.score);

        $(document).on('mousedown', (e) => this.hero.shoot(e, this.ui));
        $(document).on('mousemove', (e) => this.hero.move(e));
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
        }, 10);
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
        this.entities.forEach(entity => entity.move());
    }
}

class Hero {
    constructor() {
        this.element = $('#hero');
        this.ammo = 10;
        this.score = 0;
        this.tracking = true;
        this.shootInterval = null;
    }

    move(event) {
        if (this.tracking) {
            this.element.css('left', event.pageX + 'px');
        }
    }

    shoot(event, ui) {
        if (event.which === 1 && this.ammo > 0) {
            this.tracking = true;
            this.fireBullet(ui);
            this.shootInterval = setInterval(() => this.fireBullet(ui), 100);
        }
    }

    fireBullet(ui) {
        if (this.ammo > 0) {
            new Bullet(this.element.offset().left);
            this.ammo--;
            ui.updateAmmo(this.ammo);
        }
    }

    stopShooting() {
        clearInterval(this.shootInterval);
    }

    setTracking(value) {
        this.tracking = value;
    }
}

class Bullet {
    constructor(x) {
        this.element = $('<div class="bullet"></div>');
        this.x = x;
        this.y = $('#hero').offset().top;
        $('#fired-bullets').append(this.element);
        this.element.css({ left: this.x + 'px', bottom: '10px' });
    }
}

class Enemy {
    constructor() {
        this.element = $('<div class="enemy"></div>');
        this.y = 0;
        $('#enemies').append(this.element);
    }

    move() {
        this.y += 1;
        this.element.css('top', this.y + 'px');
    }
}

class Wall {
    constructor() {
        this.element = $('<div class="wall"></div>');
        this.y = 0;
        $('#walls').append(this.element);
    }

    move() {
        this.y += 1;
        this.element.css('top', this.y + 'px');
    }
}

class UI {
    updateAmmo(count) {
        $('#ammo .value').text(count);
    }
    
    updateScore(points) {
        let scoreElem = $('#score .value');
        let currentScore = parseInt(scoreElem.text()) || 0;
        scoreElem.text(currentScore + points);
    }
}

$(document).ready(() => {
    new Game();
});