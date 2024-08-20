class Spring extends VerletSpring3D {
    constructor(a, b) {
        super(a, b, w, 0.8);
    }
    
    display() {
        stroke(255);
        strokeWeight(2);
        line(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z);
    } 
  }