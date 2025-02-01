// =========================
// Elementy DOM
// =========================
const hero = $('#hero');                    //# Bohater
const map = $('#map');                      //# Mapa
const ammoCounter = $('#ammo bdi');         //# Wyświetla ilość amunicji
const score = $('#score bdi');              //# Wyświetla wynik
const bullets = $('#bullets');              //# Pociski
const firedBullets = $('#fired-bullets');   //# Wystrzelone pociski
const walls = $('#walls');                  //# Ściany
const enemies = $('#enemies');              //# Wrogowie

// =========================
// Stałe
// =========================
const heroWidth = hero.width();             //# Szerokość bohatera
const heroHeight = hero.height();           //# Wysokość bohatera
const shootDelay = 100;                     //# Czas między strzałem
const bulletDistance = 10;                  //# Odległość pocisku 
const bulletRefreshRate = 10;               //# Czas odświeżania pocisku
const wallCreationRate = 3000;              //# Czas tworzenia ściany
const wallHealthValue = 10;                 //# Wartość zdrowia ściany
const wallMoveSpeed = 10;                   //# Prędkość poruszania się ściany
const enemyCreationRate = 5000;             //# Czas tworzenia wroga
const enemyHealthValue = 20;                //# Wartość zdrowia wroga
const enemyMoveSpeed = 10;                  //# Prędkość poruszania się wroga

// =========================
// Zmienne
// =========================
let tracking = false;                       //# Czy śledzimy ruch myszy
let startHeroX = 0;                         //# Początkowe położenie bohatera
let startBulletsX = 0;                      //# Początkowe położenie pocisku
let ammoValue = 0;                          //# Liczba amunicji
let scoreValue = 0;                         //# Wynik
let mapWidth = 0;                           //# Szerokość mapy
let mapTopBoundry = 0;                      //# Górna granica mapy
let minHeroX = 0;                           //# Minimalne położenie bohatera
let maxHeroX = 0;                           //# Maksymalne położenie bohatera
let heroHealth = 100;                       //# Zdrowie bohatera
let shootInterval = null;                   //# Interval strzału
let bulletId = 0;                           //# Identyfikator pocisku
let bulletDistanse = 0;                     //# Dystans pocisku
let wallId = 0;                             //# Identyfikator ściany
let enemyId = 0;                            //# Identyfikator wroga

// =========================
// Inicjalizacja
// =========================
$(document).ready(function() {
    // Pobiera wymiary mapy
    const mapSize = getMapSize();
    mapWidth = mapSize.width;
    mapTopBoundry = mapSize.height;
    // Oblicza środek
    const center = getCenter(mapSize.width, mapSize.height);
    // Ustawia parametry bohatera
    minHeroX = 0 + heroWidth / 2;
    maxHeroX = mapWidth - heroWidth;
    setX(hero, center.x);
    setX(bullets, center.x);
    setHeroHealth(heroHealth);
    bulletDistanse = mapTopBoundry - heroHeight;
    // Ustawia startową amunicję
    ammoValue = 100;
    setAmo(ammoValue);
    createMultipleBullets(ammoValue);
    // Rozpoczyna tworzenie ścian
    setInterval(createWall, wallCreationRate);
    // Rozpoczyna tworzenie wrogów
    setInterval(createEnemy, enemyCreationRate);
});

// =========================
// Eventy myszy
// =========================
$(document).on('mousedown', function(e) {
    if (e.which === 1) {
        // Ruch
        tracking = true;
        startMouseX = e.pageX;
        startHeroX = parseFloat(hero.css('left')) || 0;
        startBulletsX = parseFloat(bullets.css('left')) || 0;

        // Strzał
        shoot();
        shootInterval = setInterval(shoot, shootDelay);
    }
});

$(document).on('mousemove', function(e) {
    if (tracking) {
        const deltaX = e.pageX - startMouseX;
        setX(hero, startHeroX + deltaX, minHeroX, maxHeroX);
        setX(bullets, startBulletsX + deltaX, minHeroX, maxHeroX);
    }
});

$(document).on('mouseup', function(e) {
    if (e.which === 1) {
        tracking = false;
        clearInterval(shootInterval);
    }
});

// =========================
// Funkcje pomocnicze
// =========================
function setX(selector, x, minBound, maxBound) {
    if (x < minBound) x = minBound;
    if (x > maxBound) x = maxBound;
    
    // Ustawia położenie w osi X
    selector.css('left', x + 'px');
}

function setCoords(selector, x, y) {
    // Ustawia położenie X i Y
    selector.css('left', x + 'px');
    selector.css('top', y + 'px');
}

function getMapSize() {
    // Zwraca szerokość i wysokość mapy
    return {
        width: map.width(),
        height: map.height()
    };
}

function getHeroCoords() {
    // Zwraca położenie bohatera
    return {
        x: hero.css('left'),
        y: hero.css('top')
    };
}

function getCenter(width, height){
    // Oblicza punkt środkowy
    return {
        x: width / 2,
        y: height / 2
    };
}

function setAmo(count) {
    // Ustawia ilość amunicji
    ammoValue = count;
    ammoCounter.text(ammoValue);
}

function setScore(count) {
    // Ustawia wynik
    scoreValue = count;
    score.text(scoreValue);
}

function setHeroHealth(count) {
    // Ustawia zdrowie bohatera
    heroHealth = count;
    $('#hero-health').css('height', heroHealth + '%');
}

function shoot() {
    // Strzał
    if (ammoValue > 0) {
        fireBullet($('.bullet#bullet-' + ammoValue));
        ammoValue--;
        setAmo(ammoValue);
    }
}

function createBullet() {
    // Tworzy pocisk
    bulletId++;
    const bullet = $('<div class="bullet" id="bullet-' + bulletId + '"></div>');
    bullets.append(bullet);
    return bullet;
}

function createMultipleBullets(count) {
    // Tworzy wiele pocisków
    for (let i = 0; i < count; i++) {
        createBullet();
    }
}

function removeBullet() {
    // Usuwa pocisk
    const bullet = $('.bullet').last();
    bulletId--;
    bullet.remove();
}

function fireBullet(bullet) {
    const bulletsX = parseFloat(bullets.css('left'));
    // Wystrzeliwuje pocisk
    firedBullets.append(bullet);
    bullet.css('left', bulletsX);
    moveBullet(bullet);
}

function moveBullet(bullet) {
    // Porusza pocisk
    const startBulletY = parseFloat(bullet.css('bottom'));
    
    let currentBulletY = startBulletY;
    
    bullet.css('bottom', startBulletY + 'px');
    
    if (currentBulletY > bulletDistanse) {
        bullet.remove();
    } else {
        setTimeout(function() {
            bullet.css('bottom', currentBulletY + bulletDistance + 'px');
            moveBullet(bullet);
        }, bulletRefreshRate);
    }
}

function createWall() {
    // Tworzy ścianę
    const randomX = Math.floor(Math.random() * (mapWidth - 100));
    const wall = $('<div class="wall" id="wall-' + wallId + '" style="left: ' + randomX + 'px">' + wallHealthValue + '</div>');
    walls.append(wall);
    wallId++;
    // Porusza ścianę
    moveWall(wall);
}

function moveWall(wall) {
    const startWallY = parseFloat(wall.css('top'));
    
    let currentWallY = startWallY;
    
    wall.css('top', startWallY + 'px');
    
    if (currentWallY > mapTopBoundry) {
        wall.remove();
    } else {
        setTimeout(function() {
            wall.css('top', currentWallY + 1 + 'px');
            moveWall(wall);
        }, wallMoveSpeed);
    }
}

function createEnemy() {
    // Tworzy wroga
    const randomX = Math.floor(Math.random() * (mapWidth - 100));
    const enemy = $('<div class="enemy" id="enemy-' + enemyId + '" style="left: ' + randomX + 'px">' + enemyHealthValue + '</div>');
    enemies.append(enemy);
    enemyId++;
    // Porusza wroga
    moveEnemy(enemy);
}

function moveEnemy(enemy) {
    const startEnemyY = parseFloat(enemy.css('top'));
    
    let currentEnemyY = startEnemyY;
    
    enemy.css('top', startEnemyY + 'px');
    
    if (currentEnemyY > mapTopBoundry) {
        enemy.remove();
    } else {
        setTimeout(function() {
            enemy.css('top', currentEnemyY + 1 + 'px');
            moveEnemy(enemy);
        }, enemyMoveSpeed);
    }
}