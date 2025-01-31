// =========================
// Zmienne globalne
// =========================
const hero = $('#hero');                    //# Bohater
const map = $('#map');                      //# Mapa
const ammoCounter = $('#ammo bdi');         //# Wyświetla ilość amunicji
const score = $('#score bdi');              //# Wyświetla wynik

let tracking = false;                       //# Czy śledzimy ruch myszy
let startHeroX = 0;                         //# Początkowe położenie bohatera
let startHeroY = 0;                         //# Możliwe użycie w przyszłości
let ammoValue = 0;                          //# Liczba amunicji
let scoreValue = 0;                         //# Wynik

// =========================
// Inicjalizacja
// =========================
$(document).ready(function() {
    // Pobiera wymiary mapy
    const mapSize = getMapSize();
    // Oblicza środek
    const center = getCenter(mapSize.width, mapSize.height);
    // Ustawia bohatera na środku
    setX(hero, center.x);
    // Ustawia startową amunicję
    ammoValue = 100;
    setAmo(ammoValue);
});

// =========================
// Eventy myszy
// =========================
$(document).on('mousedown', function(e) {
    if (e.which === 1) {
        tracking = true;
        startMouseX = e.pageX;
        startHeroX = parseFloat(hero.css('left')) || 0;
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
    }
});

// =========================
// Funkcje pomocnicze
// =========================
function setX(selector, x) {
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