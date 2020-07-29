const P2 = Math.PI/2;
const P3 = 3 * Math.PI/2;
const DR = 0.0174533;

class Player
{
    constructor()
    {
        this.x = 300;
        this.y = 300;
        this.moveSpeed = 3;
        this.rotateSpeed = Math.PI / 64;
        this.angle = 0;
    }

    update()
    {
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
        noStroke();
        fill(255, 0, 0);
        ellipse(this.x, this.y, 10, 10);
        stroke(255, 0, 0);
        line(this.x, this.y, this.x + Math.cos(this.angle) * 15, this.y + Math.sin(this.angle) * 15);
        noStroke();
    }

    drawRays(map)
    {
        let r,mx,my,mp,dof,rx,ry,ra,xo,yo,color;
        ra = this.angle-DR*30;
        if (ra<0) ra+=2*PI;
        if (ra>2*PI) ra-=2*PI;

        for (r=0; r<60; r++)
        {
            let disT;

            //Check Horizontal Lines
            let disH = Number.MAX_VALUE
            let hx = this.y;
            let hy = this.y;
            dof=0;
            let aTan = -1/Math.tan(ra);
            
            //Looking up
            if (ra > PI){ ry= (Math.floor(Math.floor(this.y>>6)<<6)-0.0001); rx=(this.y-ry)*aTan+this.x; yo=-64; xo=-yo*aTan;} 

            //Looking down
            if (ra < PI){ ry= (Math.floor(Math.floor(this.y>>6)<<6)+64); rx=(this.y-ry)*aTan+this.x; yo= 64; xo=-yo*aTan;} 

            //Looking straight left or right
            if (ra == 0 || ra == PI ){rx=this.x; ry=this.y; dof=8;} 
            
            while (dof<8)
            {
                mx = Math.floor(rx>>6); my = Math.floor(ry>>6); mp=my*map.width+mx;
                if (mp > 0 && mp < map.width*map.height && map.tiles[mp] > 0) {hx=rx; hy=ry; disH=dist(this.x,this.y,hx,hy); dof=8; color=map.tiles[mp];}
                else {rx+=xo; ry+=yo; dof+=1}
            }

            //Check Vertical Lines
            let disV = Number.MAX_VALUE;
            let vx = this.y;
            let vy = this.y;
            dof=0;
            let nTan = -Math.tan(ra);
            
            //Looking left
            if (ra > P2 && ra < P3){ rx= (Math.floor(Math.floor(this.x>>6)<<6)-0.0001); ry=(this.x-rx)*nTan+this.y; xo=-64; yo=-xo*nTan;} 
            
            //Looking right
            if (ra<P2 || ra>P3){ rx= (Math.floor(Math.floor(this.x>>6)<<6)+64); ry=(this.x-rx)*nTan+this.y; xo= 64; yo=-xo*nTan;}

            //Looking straight up or down
            if (ra == 0 || ra == PI ){rx=this.x; ry=this.y; dof=8;} 
            
            while (dof<8)
            {
                mx = Math.floor(rx>>6); my = Math.floor(ry>>6); mp=my*map.width+mx;
                if (mp > 0 && mp < map.width*map.height && map.tiles[mp] > 0) {vx=rx; vy=ry; disV=dist(this.x,this.y,vx,vy); dof=8; color=map.tiles[mp];}
                else {rx+=xo; ry+=yo; dof+=1}
            }

            if (disV<disH)
            {
                rx=vx;
                ry=vy;
                disT = disV;
                let cArr = map.colors[color].bright;
                fill(cArr[0], cArr[1], cArr[2]);
            }

            if (disH<disV)
            {
                rx=hx;
                ry=hy;
                disT = disH;
                let cArr = map.colors[color].dark;
                fill(cArr[0], cArr[1], cArr[2]);
            }
            
            stroke(255, 0, 255);
            line(this.x, this.y, rx, ry)
            noStroke();

            ra += DR;
            if (ra<0) ra+=2*PI;
            if (ra>2*PI) ra-=2*PI;

            
            //Draw 3D View
            let ca=this.angle-ra;
            if (ca<0) ca+=2*PI;
            if (ca>2*PI) ca-=2*PI;
            disT=disT*Math.cos(ca); //fix fish eye

            let lineH = (64 * 320)/disT;
            let lineO = 150-lineH/2;
            if (lineH > 320) lineH = 320;

            push();
            translate(530, 0);

            rect(r*8,lineO,8,lineH);
            pop();
        }
    }
}
