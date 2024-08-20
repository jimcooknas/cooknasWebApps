// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

class Boid {
    constructor() {
      this.position = createVector(random(width), random(height));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(random(2, 4));
      this.acceleration = createVector();
      this.maxForce = 0.05;
      this.maxSpeed = 7;
      this.size = 1;
      this.isPredator = false;
    }
  
    edges() {
      if(this.position.x < perceptionRadius)this.velocity.x += turn;
      if(this.position.y < perceptionRadius)this.velocity.y += turn;
      if(this.position.x > width - perceptionRadius)this.velocity.x -= turn;
      if(this.position.y > height - perceptionRadius)this.velocity.y -= turn;
    }
  
    align(boids) {
      let perception = this.isPredator ? 2 * perceptionRadius : perceptionRadius;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perception) {
          steering.add(other.velocity);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    separation(boids) {
      //let perceptionRadius = 50;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(
          this.position.x,
          this.position.y,
          other.position.x,
          other.position.y
        );
        if (other != this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    cohesion(boids) {
      //let perceptionRadius = 100;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(
          this.position.x,
          this.position.y,
          other.position.x,
          other.position.y
        );
        if (other != this && d < perceptionRadius) {
          steering.add(other.position);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }

    avoidPredators(boids){
      for(let boid of boids){
        if(boid.isPredator &&  dist(this.position.x, this.position.y, boid.position.x, boid.position.y)<perceptionRadius){
          this.velocity.x -= (boid.position.x-this.position.x) * avoidSlider.value()*0.1;
          this.velocity.y -= (boid.position.y-this.position.y) * avoidSlider.value()*0.1;
        }
      }

    }
  
    flock(boids) {
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
      this.avoidPredators(boids);
  
      alignment.mult(alignSlider.value());
      cohesion.mult(cohesionSlider.value());
      separation.mult(separationSlider.value());
      //avoid.mult(avoidSlider.value());
  
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
      //this.acceleration.add(avoid);
    }
  
    update() {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
    }
  
    show() {
      let size = this.isPredator ? 2*this.size : this.size;
      strokeWeight(5);
      this.isPredator ? stroke(255,255,0) : stroke(255);
      this.isPredator ? fill(255,255,0) : fill(255);
      push();
      //point(this.position.x, this.position.y);
      translate(this.position.x,this.position.y);
      rotate(this.velocity.heading());
      beginShape();
      vertex(-size,-size/2);
      vertex(-3*size/4, 0);
      vertex(-size, size/2);
      vertex(size, 0);
      endShape(CLOSE);
      //triangle(-this.size,-this.size/2,-this.size, this.size/2, this.size,0);
      pop();
      if(showPerception.checked()){
        strokeWeight(1);
        this.isPredator ? stroke(255,255,0, 5) : fill(255,255,255, 5);
        this.isPredator ? fill(255,255,0, 30) : stroke(255,255,255, 30);
        circle(this.position.x, this.position.y, this.isPredator ? 2*perceptionRadius : perceptionRadius);
      }

    }
  }