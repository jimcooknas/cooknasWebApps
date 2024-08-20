class Spring extends VerletSpring2D {
    constructor(a, b) {
        super(a, b, w, springStrength);
        //this.restLength = w;
        //this.strength = 1.4;
    }
    
    display() {
        stroke(255);
        strokeWeight(1);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    } 
  }