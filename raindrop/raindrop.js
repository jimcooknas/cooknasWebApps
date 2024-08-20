class Drop{
    constructor(id, xPos, yPos, radius, xVel, yVel){
        this.id = id;
        this.xPos=xPos;
        this.yPos=yPos;
        this.radius=radius;
        this.xVel=xVel;
        this.yVel=yVel;
    }

    draw(curr_ctx){
        curr_ctx.beginPath();
        curr_ctx.ellipse(this.xPos, this.yPos, this.radius, this.radius, 0, 0, 2*Math.PI);
        curr_ctx.fill();
    }

    update(){
        this.xPos += this.xVel;
        this.yPos += this.yVel;
    }
}

class Pan{
    constructor(x, y, wid, hei, speed){
        this.x = x;
        this.y = y;
        this.width = wid;
        this.height = hei;
        this.speed = speed;
    }

    contains(x, y){
        return this.x <= x && x <= (this.x + this.width) && y <= this.y && y >= (this.y - this.height);
    }

    update(){
        this.x += this.speed;
    }

    draw(ct, height){
        //draw content
        if(height>this.height)height=this.height;
        ct.fillStyle = "#aaaaff99";
        ct.beginPath();
        ct.moveTo(this.x, this.y - height);
        ct.lineTo(this.x, this.y);
        ct.lineTo(this.x + this.width, this.y);
        ct.lineTo(this.x + this.width, this.y - height);
        ct.fill();
        //draw trail
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffff00";
        ct.beginPath();
        ct.moveTo(this.x, this.y - this.height);
        ct.lineTo(this.x, this.y);
        ct.lineTo(this.x + this.width, this.y);
        ct.lineTo(this.x + this.width, this.y - this.height);
        ct.stroke();
        //console.log(this.x+","+(ct.canvas.height - this.height)+"->"+this.x+","+ct.canvas.height+"->"+(this.x + this.width)+","+ct.canvas.height);
    }
}


