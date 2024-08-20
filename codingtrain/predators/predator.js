var mutation_rate = 0.01;
var predator_clone_factor = 1;
var sp;
var healthToClone = 1;

function Predator(s, x, y, dna) {
    sp=s;
    this.acceleration = sp.createVector(0, 0);
    this.velocity = sp.createVector(0, -2);
    this.position = sp.createVector(x, y);
    this.r = 6;
    this.maxforce = 0.5;
    this.health = 1;
    this.maxhealth = 1;
    /** 0=MaxSpeed(1, 6) 1=Prey perception(90, 100) 2=Prey weight(-2, 2) */
    this.dna = [];
    if (dna === undefined) {
        // MaxSpeed
        this.dna[0] = sp.random(parseInt(rangePredSpeedMin.value), parseInt(rangePredSpeedMax.value));
        // Prey perception
        this.dna[1] = sp.random(parseInt(rangePreyPercMin.value), parseInt(rangePreyPercMax.value));
        // Prey weight
        this.dna[2] = sp.random(parseInt(rangePreyWeightMin.value), parseInt(rangePreyWeightMax.value));
    } else {
        // Mutation
        this.dna[0] = dna[0];
        this.dna[1] = dna[1];
        this.dna[2] = dna[2];
        if (sp.random(1) < mutation_rate) {
            this.dna[0] += sp.random(-1, 1);
        }
        if (sp.random(1) < mutation_rate) {
            this.dna[1] += sp.random(-0.1, 0.1);
        }
        if (sp.random(1) < mutation_rate) {
            this.dna[2] += sp.random(-0.1, 0.1);
        }
    }
    this.maxspeed = this.dna[0];

    // Method to update location
    this.update = function() {

        //var aux = this.dna[0] / 1000;
        this.health -= 0.002;
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    this.applyForce = function(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    this.clone = function() {
        if (sp.random(1) < predator_clone_factor/1000 && this.health > healthToClone) {
            return new Predator(sp, this.position.x, this.position.y, this.dna);
        } else {
            return null;
        }
    }

    this.behaviors = function() {
        var steerG = this.eat(0.8, this.dna[1]);
        steerG.mult(this.dna[2]);
        this.applyForce(steerG);
    }


    this.eat = function(nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = vehicles.length - 1; i >= 0; i--) {
            var d = this.position.dist(vehicles[i].position);
            if (d < this.maxspeed) {
                vehicles.splice(i, 1);
                if (this.health < this.maxhealth) {
                    this.health += nutrition;
                }
            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = vehicles[i].position;
                }
            }
        }
        // This is the moment of eating!
        if (closest != null) {
            return this.seek(closest);
        }

        return sp.createVector(0, 0);
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    this.seek = function(target) {

        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Scale to maximum speed
        desired.setMag(this.maxspeed);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

        return steer;
        //this.applyForce(steer);
    }

    this.dead = function() {
        return (this.health < 0)
    }

    this.display = function() {
        // Draw a triangle rotated in the direction of velocity
        var angle = this.velocity.heading() + sp.PI / 2;

        sp.push();
        sp.translate(this.position.x, this.position.y);
        sp.rotate(angle);

        // if (showPerception.checked) {
        //     strokeWeight(1);
        //     stroke(0, 255, 0);
        //     noFill();
        //     line(0, 0, 0, -this.dna[0] * 10);
        //     strokeWeight(2);
        //     //ellipse(0, 0, this.dna[2] * 2);
        //     stroke(255, 0, 0);
        //     line(0, 0, 0, -this.dna[1] / 5);
        //     //ellipse(0, 0, this.dna[3] * 2);
        // }

        var gr = sp.color(255, 0, 0);
        var rd = sp.color(50, 0, 0);
        var col = sp.lerpColor(rd, gr, this.health);

        sp.fill(col);
        sp.stroke(col);
        sp.strokeWeight(1);
        sp.beginShape();
        sp.vertex(0, -this.r * 2);
        sp.vertex(-this.r, this.r * 2);
        sp.vertex(0, this.r);
        sp.vertex(this.r, this.r * 2);
        sp.endShape(sp.CLOSE);
        sp.pop();
    }


    this.boundaries = function() {
        var d = 25;

        var desired = null;

        if (this.position.x < d) {
            desired = sp.createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > sp.width - d) {
            desired = sp.createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = sp.createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > sp.height - d) {
            desired = sp.createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}