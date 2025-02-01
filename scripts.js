class Game {
    constructor() {
        this.hero = new Hero();
        this.ui = new UI();
        this.enemies = [];
        this.bullets = [];
        this.walls = [];
        
        this.init();
    }

    init() {
        this.ui.updateAmmo(this.hero.ammo);
        this.ui.updateScore(this.hero.score);

        $(document).on('mousedown', (e) => this.hero.shoot(e, this.bullets, this.ui));
        $(document).on('mousemove', (e) => this.hero.move(e));
        $(document).on('mouseup', () => this.hero.stopShooting());

        setInterval(() => this.createEnemy(), 5000);
        setInterval(() => this.createWall(), 3000);
        this.gameLoop();
    }

    createEnemy() {
        const enemy = new Enemy();
        this.enemies.push(enemy);
    }

    createWall() {
        const wall = new Wall();
        this.walls.push(wall);
    }

    gameLoop() {
        setInterval(() => {
            this.bullets.forEach(bullet => bullet.move(this.enemies, this.ui));
            this.enemies.forEach(enemy => enemy.move());
            this.walls.forEach(wall => wall.move());
        }, 50);
    }
}

class Hero {
    constructor() {
        this.element = $('#hero');
        this.ammo = 100;
        this.score = 0;
        this.tracking = false;
        this.shootInterval = null;
    }

    move(event) {
        if (this.tracking) {
            this.element.css('left', event.pageX + 'px');
        }
    }

    shoot(event, bulletsArray, ui) {
        if (event.which === 1 && this.ammo > 0) {
            this.tracking = true;
            this.fireBullet(bulletsArray, ui);
            this.shootInterval = setInterval(() => this.fireBullet(bulletsArray, ui), 100);
        }
    }

    fireBullet(bulletsArray, ui) {
        if (this.ammo > 0) {
            const bullet = new Bullet(this.element.offset().left);
            bulletsArray.push(bullet);
            this.ammo--;
            ui.updateAmmo(this.ammo);
        }
    }

    stopShooting() {
        this.tracking = false;
        clearInterval(this.shootInterval);
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

    move(enemies, ui) {
        this.y -= 10;
        this.element.css('top', this.y + 'px');
        
        enemies.forEach((enemy, index) => {
            if (this.checkCollision(enemy)) {
                enemy.takeDamage(ui);
                this.element.remove();
            }
        });
    }

    checkCollision(enemy) {
        let bulletRect = this.element[0].getBoundingClientRect();
        let enemyRect = enemy.element[0].getBoundingClientRect();
        
        return !(bulletRect.top > enemyRect.bottom ||
                 bulletRect.bottom < enemyRect.top ||
                 bulletRect.left > enemyRect.right ||
                 bulletRect.right < enemyRect.left);
    }
}

class Enemy {
    constructor() {
        this.element = $('<div class="enemy"></div>');
        this.health = 20;
        this.x = Math.random() * ($('#map').width() - 50);
        this.y = 0;
        $('#enemies').append(this.element);
        this.element.css({ left: this.x + 'px', top: this.y + 'px' });
    }

    move() {
        this.y += 2;
        this.element.css('top', this.y + 'px');
        if (this.y > $('#map').height()) {
            this.element.remove();
        }
    }

    takeDamage(ui) {
        this.health -= 10;
        if (this.health <= 0) {
            this.element.remove();
            ui.updateScore(10);
        }
    }
}

class Wall {
    constructor() {
        this.element = $('<div class="wall"></div>');
        this.x = Math.random() * ($('#map').width() - 100);
        this.y = 0;
        $('#walls').append(this.element);
        this.element.css({ left: this.x + 'px', top: this.y + 'px' });
    }

    move() {
        this.y += 1;
        this.element.css('top', this.y + 'px');
        if (this.y > $('#map').height()) {
            this.element.remove();
        }
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