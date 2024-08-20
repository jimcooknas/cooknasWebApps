class Beam{
    constructor(ctx, center, radius, obstacleY, slits, width, endHeight){
        this.ctx = ctx;
        this.center = center;
        this.radius = radius;
        this.intensity = 1;
        this.speed = 1;
        this.obstacleY = obstacleY;
        this.slitsX = slits;
        this.maxRadius = width/2;
        this.endHeight = endHeight;
        this.alive = true;
        this.passedThroughSlit = false;
    }

    draw(){
        this.ctx.strokeStyle = "#ff0000cc"; //"rgb("+(255*this.intensity)+",255,0)";
        this.ctx.beginPath();
        this.ctx.arc(this.center[0], this.center[1], this.radius, 0, Math.PI, false);
        this.ctx.stroke()
    }

    update(){
        //if(this.alive) 
            this.radius += this.speed;
        if(this.radius > this.maxRadius) {this.alive = false;/*console.log("max radius exceeded "+this.radius+" > " + this.maxRadius);*/}
    }
}