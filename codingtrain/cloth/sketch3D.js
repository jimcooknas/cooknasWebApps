let cols = 40;
let rows = 40;

let particles = make2DArray(cols,rows);
let springs = [];

let w = 10;
let grabTolerance = 10;
let a;

let physics;

function setup() {
    createCanvas(800, 600); 
    physics = new VerletPhysics3D();
    let gravity = new Vec3D(0, 1, 0);
    let gb = new GravityBehavior(gravity);
    physics.addBehavior(gb);

    let x = -cols*w/2;
    for (let i = 0; i < cols; i++) {
        let z = 0;
        for (let j = 0; j < rows; j++) {
            let p = new Particle(x, -200, z);
            particles[i][j] = p;
            physics.addParticle(p);
            z = z + w;
        }
        x = x + w;
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let a = particles[i][j];
            if (i != cols-1) {
                let b1 = particles[i+1][j];
                let s1 = new Spring(a, b1);
                springs.push(s1);
                physics.addSpring(s1);
            }
            if (j != rows-1) {
                let b2 = particles[i][j+1];
                let s2 = new Spring(a, b2);
                springs.push(s2);
                physics.addSpring(s2);
            }
        }
    }

  particles[0][0].lock();
  particles[cols-1][0].lock();
  particles[0][rows-1].lock();
  particles[cols-1][rows-1].lock();

}

function draw() {
    background(51);
    translate(width/2, height/2);
    rotateY(a);
    a += 0.01;
    physics.update();

    // for (let i = 0; i < cols; i++) {
    //     for (let j = 0; j < rows; j++) {
    //         particles[i][j].display();
    //     }
    // }
    particles[0][0].display();
    particles[cols-1][0].display();
    particles[0][rows-1].display();
    particles[cols-1][rows-1].display();

    for (let s of springs) {
        s.display();
    }
}

function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function mousePressed(){
    if (abs(mouseX - particles[0][0].x) < grabTolerance && abs(mouseY - particles[0][0].y) < grabTolerance) {
        particles[0][0].grab = true;

    }
    if (abs(mouseX - particles[0][rows-1].x) < grabTolerance && abs(mouseY - particles[0][rows-1].y) < grabTolerance) {
        particles[0][rows-1].grab = true;

    }
    if (abs(mouseX - particles[cols-1][0].x) < grabTolerance && abs(mouseY - particles[cols-1][0].y) < grabTolerance) {
        particles[cols-1][0].grab = true;

    }
    if (abs(mouseX - particles[cols-1][rows-1].x) < grabTolerance && abs(mouseY - particles[cols-1][rows-1].y) < grabTolerance) {
        particles[cols-1][rows-1].grab = true;

    }
}

function mouseReleased(){
    particles[0][0].grab = false;
    particles[cols-1][0].grab = false;
    particles[0][rows-1].grab = false;
    particles[cols-1][rows-1].grab = false;
}

function mouseDragged() {
    if (particles[0][0].grab){
        particles[0][0].x = mouseX;
        particles[0][0].y = mouseY;
    }
    if (particles[0][rows-1].grab){
        particles[0][rows-1].x = mouseX;
        particles[0][rows-1].y = mouseY;
    }
    if (particles[cols-1][0].grab){
        particles[cols-1][0].x = mouseX;
        particles[cols-1][0].y = mouseY;
    }
    if (particles[cols-1][rows-1].grab){
        particles[cols-1][rows-1].x = mouseX;
        particles[cols-1][rows-1].y = mouseY;
    }
}
