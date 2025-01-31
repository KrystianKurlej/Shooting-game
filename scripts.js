// =========================
// Zmienne globalne
// =========================
const hero = $('#hero');                    //# Bohater
const heroWidth = hero.width();             //# Szerokość bohatera
const map = $('#map');                      //# Mapa
const ammoCounter = $('#ammo bdi');         //# Wyświetla ilość amunicji
const score = $('#score bdi');              //# Wyświetla wynik
const shootDelay = 100;                     //# Czas między strzałem

let tracking = false;                       //# Czy śledzimy ruch myszy
let startHeroX = 0;                         //# Początkowe położenie bohatera
let startHeroY = 0;                         //# Możliwe użycie w przyszłości
let ammoValue = 0;                          //# Liczba amunicji
let scoreValue = 0;                         //# Wynik
let mapWidth = 0;                           //# Szerokość mapy
let minHeroX = 0;                           //# Minimalne położenie bohatera
let maxHeroX = 0;                           //# Maksymalne położenie bohatera
let heroHealth = 100;                       //# Zdrowie bohatera
let shootInterval = null;                   //# Interval strzału

// =========================
// Inicjalizacja
// =========================
$(document).ready(function() {
    // Pobiera wymiary mapy
    const mapSize = getMapSize();
    mapWidth = mapSize.width;
    // Oblicza środek
    const center = getCenter(mapSize.width, mapSize.height);
    // Ustawia parametry bohatera
    minHeroX = 0 + heroWidth / 2;
    maxHeroX = mapWidth - heroWidth;
    setX(hero, center.x);
    setHeroHealth(heroHealth);
    // Ustawia startową amunicję
    ammoValue = 100;
    setAmo(ammoValue);
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

        // Strzał
        shoot();
        shootInterval = setInterval(shoot, shootDelay);
    }
});

$(document).on('mousemove', function(e) {
    if (tracking) {
        const deltaX = e.pageX - startMouseX;
        setX(hero, startHeroX + deltaX);
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
function setX(selector, x) {
    if (x < minHeroX) x = minHeroX;
    if (x > maxHeroX) x = maxHeroX;
    
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
    if (ammoValue > 0) {
        ammoValue--;
        setAmo(ammoValue);
    }
}