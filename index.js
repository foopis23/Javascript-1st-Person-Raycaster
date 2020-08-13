const DRAW_MAP = false;

var IMAGES;

let map;
let player;

function preload()
{
    IMAGES = {};
    IMAGES["wall"] = loadImage('wall.png');
    IMAGES["wall_grey"] = loadImage('wall_grey.png');
    IMAGES["wall_blue_window"] = loadImage('wall_blue_window.png');
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
    background(0,0,0)

    player.update();

    map.draw();
    player.draw();
    textSize(32);
    fill(255);
    text(Math.round(frameRate()), 32, 64);
}

//util
function clamp(number, min, max)
{
    return Math.max(min, Math.min(number, max));
}