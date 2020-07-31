const P2 = Math.PI/2;
const P3 = 3 * Math.PI/2;
const DR = 0.0174533;

class Player
{
    constructor(map)
    {
        this.x = 300;
        this.y = 300;
        this.moveSpeed = 3;
        this.rotateSpeed = Math.PI / 64;
        this.angle = 0;
        this.MAP = map;
        this.viewDistance = 8;
    }

    update()
    {
        //handle input
        let dx = 0;
        let dy = 0;
        let da = 0;

        if (keyIsDown(UP_ARROW))
        {
            dx += this.moveSpeed * Math.cos(this.angle);
            dy += this.moveSpeed * Math.sin(this.angle);
        }

        if (keyIsDown(DOWN_ARROW))
        {
            dx -= this.moveSpeed * Math.cos(this.angle);
            dy -= this.moveSpeed * Math.sin(this.angle);
        }

        if (keyIsDown(LEFT_ARROW))
            da -= this.rotateSpeed;

        if (keyIsDown(RIGHT_ARROW))
            da += this.rotateSpeed;

        //TODO: THIS IS VERY BASIC AND IT KIND OF MAKES PLAYERS GET STUCK ON WALLS
        //check collision
        let mapX = Math.floor((this.x + dx)>>6); 
        let mapY = Math.floor((this.y + dy)>>6); 
        let mapIndex=mapY*this.MAP.width+mapX;
        if (this.MAP.tiles[mapIndex] > 0)
        {
            dx = 0;
            dy = 0;
        } 
        

        //apply movement
        this.x += dx;
        this.y += dy;
        this.angle += da;

        if (this.angle < 0)
        {
            this.angle = this.angle + 2*Math.PI;
        }else if (this.angle >= 2*Math.PI)
        {
            this.angle = this.angle - 2*Math.PI;
        }
    }

    draw()
    {
        if (DRAW_MAP)
        {
            noStroke();
            fill(255, 0, 0);
            ellipse(this.x, this.y, 10, 10);
            stroke(255, 0, 0);
            line(this.x, this.y, this.x + Math.cos(this.angle) * 15, this.y + Math.sin(this.angle) * 15);
            noStroke();
        }
        
        let offsetHeight = (320/this.viewDistance);
        let rectHeight = (320-offsetHeight)/2 - 10;

        //draw roof
        noStroke();
        fill(this.MAP.roofColor[0], this.MAP.roofColor[1], this.MAP.roofColor[2]);
        rect(0, 0, 480, rectHeight);

        //epic fog/fade effect?
        for (let i=0; i<2; i++)
        {
            fill(this.MAP.roofColor[0], this.MAP.roofColor[1], this.MAP.roofColor[2], 200 - (i*100));
            rect(0, rectHeight+i, 480, 1);
        }


        //draw floor
        noStroke();
        fill(this.MAP.floorColor[0], this.MAP.floorColor[1], this.MAP.floorColor[2]);
        rect(0, rectHeight + offsetHeight, 480, rectHeight + 10);

        
        //epic fog/fade effect?
        for (let i=0; i<2; i++)
        {
            fill(this.MAP.floorColor[0], this.MAP.floorColor[1], this.MAP.floorColor[2], 200 - (i*100));
            rect(0, rectHeight + offsetHeight - i, 480, 1);
        }

        pop();

        this.doRayCast();
    }

    doRayCast()
    {
        let r,mx,my,mp,dof,rx,ry,ra,xo,yo,vHitID,hHitID;
        let rayLanded = false;
        ra = this.angle-DR*30;
        if (ra<0) ra+=2*PI;
        if (ra>2*PI) ra-=2*PI;
        console.log("START LOOP");
        for (r=0; r<60; r++)
        {
            let disT;

            /*
            ..######..##.....##.########..######..##....##....##.....##..#######..########..####.########..#######..##....##.########....###....##......
            .##....##.##.....##.##.......##....##.##...##.....##.....##.##.....##.##.....##..##.......##..##.....##.###...##....##......##.##...##......
            .##.......##.....##.##.......##.......##..##......##.....##.##.....##.##.....##..##......##...##.....##.####..##....##.....##...##..##......
            .##.......#########.######...##.......#####.......#########.##.....##.########...##.....##....##.....##.##.##.##....##....##.....##.##......
            .##.......##.....##.##.......##.......##..##......##.....##.##.....##.##...##....##....##.....##.....##.##..####....##....#########.##......
            .##....##.##.....##.##.......##....##.##...##.....##.....##.##.....##.##....##...##...##......##.....##.##...###....##....##.....##.##......
            ..######..##.....##.########..######..##....##....##.....##..#######..##.....##.####.########..#######..##....##....##....##.....##.########
            */
            let disH = Number.MAX_VALUE
            let hx = this.y;
            let hy = this.y;
            dof=0;
            let aTan = -1/Math.tan(ra);
            
            //Looking up
            if (ra > PI) { 
                ry= (Math.floor(Math.floor(this.y>>6)<<6)-0.0001); 
                rx=(this.y-ry)*aTan+this.x; 
                yo=-this.MAP.cellSize; 
                xo=-yo*aTan;
            } 

            //Looking down
            if (ra < PI)
            {
                ry= (Math.floor(Math.floor(this.y>>6)<<6)+this.MAP.cellSize);
                rx=(this.y-ry)*aTan+this.x; 
                yo=this.MAP.cellSize; 
                xo=-yo*aTan;
            }

            //Looking straight left or right
            if (ra == 0 || ra == PI ) {
                rx=this.x;
                ry=this.y;
                dof=this.viewDistance;
            } 
            
            while (dof<this.viewDistance)
            {
                mx = Math.floor(rx>>6); 
                my = Math.floor(ry>>6); 
                mp=my*this.MAP.width+mx;
                if (mp > 0 && mp < this.MAP.width*this.MAP.height && this.MAP.tiles[mp] > 0) {
                    hx=rx; hy=ry; 
                    disH=dist(this.x,this.y,hx,hy); 
                    dof=this.viewDistance; 
                    hHitID=this.MAP.tiles[mp];
                    rayLanded = true;
                }
                else {
                    rx+=xo;
                    ry+=yo;
                    dof+=1
                }
            }

            /*
            ..######..##.....##.########..######..##....##....##.....##.########.########..########.####..######.....###....##..........##.......####.##....##.########..######.
            .##....##.##.....##.##.......##....##.##...##.....##.....##.##.......##.....##....##.....##..##....##...##.##...##..........##........##..###...##.##.......##....##
            .##.......##.....##.##.......##.......##..##......##.....##.##.......##.....##....##.....##..##........##...##..##..........##........##..####..##.##.......##......
            .##.......#########.######...##.......#####.......##.....##.######...########.....##.....##..##.......##.....##.##..........##........##..##.##.##.######....######.
            .##.......##.....##.##.......##.......##..##.......##...##..##.......##...##......##.....##..##.......#########.##..........##........##..##..####.##.............##
            .##....##.##.....##.##.......##....##.##...##.......##.##...##.......##....##.....##.....##..##....##.##.....##.##..........##........##..##...###.##.......##....##
            ..######..##.....##.########..######..##....##.......###....########.##.....##....##....####..######..##.....##.########....########.####.##....##.########..######.
            */

            let disV = Number.MAX_VALUE;
            let vx = this.y;
            let vy = this.y;
            dof=0;
            let nTan = -Math.tan(ra);
            
            //Looking left
            if (ra > P2 && ra < P3){ 
                rx= (Math.floor(Math.floor(this.x>>6)<<6)-0.0001); 
                ry=(this.x-rx)*nTan+this.y; 
                xo=-64; 
                yo=-xo*nTan;
            } 
            
            //Looking right
            if (ra<P2 || ra>P3){ 
                rx= (Math.floor(Math.floor(this.x>>6)<<6)+64); 
                ry=(this.x-rx)*nTan+this.y; 
                xo= 64; 
                yo=-xo*nTan;
            }

            //Looking straight up or down
            if (ra == 0 || ra == PI ){rx=this.x; ry=this.y; dof=this.viewDistance;} 
            
            while (dof<this.viewDistance)
            {
                mx = Math.floor(rx>>6); 
                my = Math.floor(ry>>6); 
                mp=my*this.MAP.width+mx;
                if (mp > 0 && mp < this.MAP.width*this.MAP.height && this.MAP.tiles[mp] > 0) {
                    vx=rx; 
                    vy=ry; 
                    disV=dist(this.x,this.y,vx,vy); 
                    dof=this.viewDistance; 
                    vHitID=this.MAP.tiles[mp];
                    rayLanded = true
                }
                else {
                    rx+=xo; 
                    ry+=yo; 
                    dof+=1
                }
            }

            /*
            .########..########..######..####.########..########....########.####.##....##....###....##..........########.....###....##....##
            .##.....##.##.......##....##..##..##.....##.##..........##........##..###...##...##.##...##..........##.....##...##.##....##..##.
            .##.....##.##.......##........##..##.....##.##..........##........##..####..##..##...##..##..........##.....##..##...##....####..
            .##.....##.######...##........##..##.....##.######......######....##..##.##.##.##.....##.##..........########..##.....##....##...
            .##.....##.##.......##........##..##.....##.##..........##........##..##..####.#########.##..........##...##...#########....##...
            .##.....##.##.......##....##..##..##.....##.##..........##........##..##...###.##.....##.##..........##....##..##.....##....##...
            .########..########..######..####.########..########....##.......####.##....##.##.....##.########....##.....##.##.....##....##...
            */
            let surfaceTexture, sx;
            if (rayLanded)
            {
                if (disV<disH)
                {
                    rx=vx;
                    ry=vy;
                    disT = disV;
                    mx = Math.floor(rx>>6); 
                    my = Math.floor(ry>>6); 
                    let surface = this.MAP.colors[vHitID];
                    if (surface.type=='color')
                    {
                        let cArr = surface.bright;
                        fill(cArr[0], cArr[1], cArr[2]);
                    }else{
                        surfaceTexture = surface.image;
                        sx = Math.round(ry - my * this.MAP.cellSize);
                    }
                }
    
                if (disH<disV)
                {
                    rx=hx;
                    ry=hy;
                    disT = disH;
                    mx = Math.floor(rx>>6); 
                    my = Math.floor(ry>>6); 
                    let surface = this.MAP.colors[hHitID];
                    if (surface.type=='color')
                    {
                        let cArr = surface.dark;
                        fill(cArr[0], cArr[1], cArr[2]);
                    }else{
                        surfaceTexture = surface.image;
                        sx = Math.round(rx - mx * this.MAP.cellSize);
                    }
                }
            }

            /*
            .########..########.....###....##......##
            .##.....##.##.....##...##.##...##..##..##
            .##.....##.##.....##..##...##..##..##..##
            .##.....##.########..##.....##.##..##..##
            .##.....##.##...##...#########.##..##..##
            .##.....##.##....##..##.....##.##..##..##
            .########..##.....##.##.....##..###..###.
            */
            
            //draw rays
            if (DRAW_MAP)
            {
                stroke(255, 0, 255);
                line(this.x, this.y, rx, ry)
                noStroke();
            }

            
            //Draw 3D View
            if (rayLanded)
            {
                let ca=this.angle-ra;
                if (ca<0) ca+=2*PI;
                if (ca>2*PI) ca-=2*PI;
                disT=disT*Math.cos(ca); //fix fish eye
    
                let lineH = (64 * 320)/disT;
                if (lineH > 320) lineH = 320;
                
                let lineO = 150-lineH/2;
    
                push();
                if (DRAW_MAP)
                {
                    translate(this.MAP.width * this.MAP.cellSize, 0);
                }else{
                    scale(2,2);
                }
                
                if (lineH > 320/this.viewDistance) //fix render issue of things out of view distance
                {
                    noStroke();
                    

                    
                    if (surfaceTexture)
                    {
                        console.log(`${sx}, ${disT}`);
                        let sw = Math.min(Math.round(disT/32),1);
                        copy(surfaceTexture, Math.min(sx, 64-sw), 0, sw, 64, r*8, lineO, 8, lineH);
                    }else{
                        rect(r*8,lineO,8,lineH);
                    }
                }

                pop();

            }



            //iterate for next loop
            ra += DR;
            if (ra<0) ra+=2*PI;
            if (ra>2*PI) ra-=2*PI;
        }

        console.log("END LOOP");
    }
}
