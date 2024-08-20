class Ferormone{
    constructor(x, y, what){
        this.x = x;
        this.y = y;
        this.strength = 1;
        this.what = what;//0=to home 1=to food
    }

    update(){
        this.strength -= feroEvapRate;
    }

    show(ctx){
        ctx.beginPath();
        ctx.rect(this.x, this.y, gridSize, gridSize);
        if(this.what == 0){
            ctx.fillStyle = "rgba(255, 0, 0, "+this.strength+")";
        }else{
            ctx.fillStyle = "rgba(0, 0, 255, "+this.strength+")";
        }
        ctx.fill();
    }
}

class Food{
    constructor(x, y, strength){
        this.pos = new Victor(x, y);
        this.strength = strength;
        this.initStrength = strength;
    }

    show(ctx){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10*this.strength/this.initStrength, 0, 2*Math.PI);
        ctx.strokeStyle="rgb(0,0,0)";
        ctx.fillStyle = "rgba(0, 255, 0, "+this.strength/this.initStrength+")";
        ctx.fill();
        ctx.stroke();
    }
}