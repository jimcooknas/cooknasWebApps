class Body{
    constructor(pos,vel,mass){
        this.pos = pos;
        this.vel = vel;
        this.radius = mass;
        this.mass = mass/10;
        //this.color = rgb(190,190,0); 
        this.acc = new Vector(0,0);
    }

    update(allbodies, dt){
        var counter=0;
        allbodies.forEach(element => {
            if(element!=this){
                var force = G*this.mass*element.mass/Math.pow(this.pos.distanceFrom(element.pos),2);
                var rad = this.pos.radiansTo(element.pos);
                this.acc = this.pos.rotateRadiansSelf(rad).normalizeSelf().mulScalarSelf(force);
                this.vel.addSelf(this.acc);
                this.pos.addSelf(this.vel.mulScalarSelf(dt));
                counter++;
            }
        });
        console.log("count:"+counter+" vel:"+this.vel.x+","+this.vel.y+" pos:"+this.pos.x+","+this.pos.y+" acc:"+this.acc.x+","+this.acc.y);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
}
