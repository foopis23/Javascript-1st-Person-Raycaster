class Map {
    constructor() {
        this.width = 16;
        this.height = 8;
        this.cellSize = 64; //NOTE: This needs to be a power of 2, probably don't change this
        this.floorColor = [19, 34, 49];
        this.roofColor = [0, 0, 0];

        this.tiles = [
            6, 5, 6, 5, 6, 5, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4,
            4, 0, 0, 0, 0, 0, 6, 4, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

        this.colors = [
            {
                type: 'color',
                bright: [255, 255, 255],
                dark: [180, 180, 180]
            },
            {
                type: 'color',
                bright: [214, 199, 180],
                dark: [182, 164, 142]
            },
            {
                type: 'color',
                bright: [0, 255, 0],
                dark: [0, 180, 0]
            },
            {
                type: 'color',
                bright: [0, 0, 255],
                dark: [0, 0, 180]
            },
            {
                type: 'texture',
                image: IMAGES['wall_grey']
            },
            {
                type: 'texture',
                image: IMAGES['wall_blue_window']
            },
            {
                type: 'texture',
                image: IMAGES['wall_blue']
            }
        ];
    }

    draw()
    {
        if (DRAW_MAP)
        {
            stroke(100)
            this.tiles.forEach((val, index, arr) => {
                let x = index % this.width;
                let y = Math.floor(index / this.width);
                
                if (val > 0)
                {
                    let color =this.colors[val].bright; 
                    fill(color[0], color[1], color[2])
                }else{
                    fill(255)
                }
    
                rect(x*64,y*64,64,64)
            });
        }

        push();

        if (DRAW_MAP)
        {
            translate(this.MAP.width * this.MAP.cellSize, 0);
        }else{
            scale(2,2);
        }
    }
}