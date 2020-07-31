const DRAW_MAP = false;

var IMAGES;

let map;
let player;

function preload()
{
    IMAGES = {};
    IMAGES["test.png"] = loadImage('test.png');
}

function setup() {
    
    if (DRAW_MAP)
    {
        createCanvas(1280, 500);
    }else{
        createCanvas(960, 640);
    }

    map = new Map();
    player = new Player(map);
}

function draw() {
    clear();

    player.update();

    map.draw();
    player.draw();
    textSize(32);
    fill(255);
    text(Math.round(frameRate()), 32, 64);
}