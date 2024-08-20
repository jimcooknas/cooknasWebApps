class Particle extends VerletParticle3D {
    constructor( x,  y, z) {
        super(x, y, z);
        this.grab = false;
    }
  
    display() {
        pushMatrix();
        translate(x, y, z);
        //fill(255);
        //ellipse(this.x, this.y, 10, 10);
        popMatrix();
    }
}
