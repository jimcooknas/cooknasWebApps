class Particle extends VerletParticle2D {
    constructor( x,  y) {
        super(x, y);
        this.grab = false;
    }
  
    display() {
        if(this.grab){
            fill(255, 255, 55);
        }else{
            fill(200, 200, 255);
        }
        noStroke();
        ellipse(this.x, this.y, 8, 8);
    }
}

class Dragger extends VerletParticle2D {
    constructor( x, y, r) {
        super(x, y);
        this.r = r;
    }
  
    display() {
        stroke(255, 0, 0);
        noFill();
        ellipse(this.x, this.y, this.r, this.r);
    }
}
