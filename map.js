class Map {
    constructor() {
        this.width = 16;
        this.height = 8;
        this.cellSize = 64; //NOTE: This needs to be a power of 2, probably don't change this
        this.floorColor = [30, 30, 40];
        this.roofColor = [150, 150, 150];

        this.tiles = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ];

        this.colors = [
            {
                bright: [255, 255, 255],
                dark: [180, 180, 180]
            },
            {
                bright: [214, 199, 180],
                dark: [182, 164, 142]
            },
            {
                bright: [0, 255, 0],
                dark: [0, 180, 0]
            },
            {
                bright: [0, 0, 255],
                dark: [0, 0, 180]
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