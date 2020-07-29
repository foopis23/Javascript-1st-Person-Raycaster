let map;
let player;

function setup() {
    createCanvas(1280, 500);
    map = new Map();
    player = new Player();
}

function draw() {
    clear();

    player.update();

    map.draw();
    player.drawRays(map);
    player.draw();
}