// Vehicles health decreases faster if he moves faster

var mr = 0.01;
var prey_clone_factor = 2;
var sv;
var healthToClone = 2;

function Vehicle(ss, x, y, dna) {
    sv=ss;
    this.acceleration = sv.createVector(0, 0);
    this.velocity = sv.createVector(0, -2);
    this.position = sv.createVector(x, y);
    this.r = 4;
    this.maxforce = 0.5;
    //    this.health = 1;
    /** 0=Food weight(-2, 2) 1=Prey weight(-2, 2) 2=Food perception(0, 100) 3=Prey Percepton(0, 100) 4=MaxSpeed(1, 10) 5=Mass(0.5, 10)*/
    this.dna = [];
    if (dna === undefined) {
        // Food weight
        this.dna[0] = sv.random(parseInt(rangeFoodWeightMin.value), parseInt(rangeFoodWeightMax.value));//-2, 2
        // Poison/Prey weight
        this.dna[1] = sv.random(parseInt(rangePredWeightMin.value), parseInt(rangePredWeightMax.value));//-2, 2
        // Food perception
        this.dna[2] = sv.random(parseInt(rangeFoodPercMin.value), parseInt(rangeFoodPercMax.value));//0, 100
        // Poision/Prey Percepton
        this.dna[3] = sv.random(parseInt(rangePredPercMin.value), parseInt(rangePredPercMax.value));//0, 100
        // MaxSpeed
        this.dna[4] = sv.random(parseInt(rangeSpeedMin.value), parseInt(rangeSpeedMax.value));//1, 10
        // Mass
        this.dna[5] = sv.random(parseInt(rangeMassMin.value), parseInt(rangeMassMax.value));// 1, 10
    } else {
        // Mutation
        this.dna[0] = dna[0];
        if (sv.random(1) < mr) {
            this.dna[0] += sv.random(-0.1, 0.1);
        }
        this.dna[1] = dna[1];
        if (sv.random(1) < mr) {
            this.dna[1] += sv.random(-0.1, 0.1);
        }
        this.dna[2] = dna[2];
        if (sv.random(1) < mr) {
            this.dna[2] += sv.random(-10, 10);
        }
        this.dna[3] = dna[3];
        if (sv.random(1) < mr) {
            this.dna[3] += sv.random(-10, 10);
        }
        this.dna[4] = dna[4];
        if (sv.random(1) < mr) {
            this.dna[4] += sv.random(-1, 1);
        }
        this.dna[5] = dna[5];
        if (sv.random(1) < mr) {
            this.dna[5] += sv.random(-0.1, 0.1);
        }
    }
    this.maxspeed = this.dna[4];

    var h = sv.map(this.dna[5], 0, 10, 1, 5);
    this.health = h;

    // Method to update location
    this.update = function() {

        var aux = this.dna[4] / 1000;
        // this.health -= 0.005;
        this.health -= aux;

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
        var f = force.div(this.dna[5]);
        this.acceleration.add(f);
    }

    this.clone = function() {
        if (sv.random(1) < prey_clone_factor/1000 && this.health > healthToClone) {
            return new Vehicle(sv, this.position.x, this.position.y, this.dna);
        } else {
            return null;
        }
    }

    this.behaviors = function(good) {
        var steerG = this.eat(good, 1, this.dna[2]);
        var steerP = this.foge(this.dna[3])
        steerG.mult(this.dna[0]);
        steerP.mult(this.dna[1]);
        this.applyForce(steerG);
        this.applyForce(steerP);
    }

    this.foge = function(perception) {
        var record = Infinity;
        var closest = null;
        for (var i = predators.length - 1; i >= 0; i--) {
            var d = this.position.dist(predators[i].position);
            if (d < record && d < perception) {
                record = d;
                closest = predators[i].position;
            }
        }
        if (closest != null) {
            return this.seek(closest);
        }
        return sv.createVector(0, 0);
    }

    this.eat = function(list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(list[i]);
            if (d < this.maxspeed) {
                list.splice(i, 1);
                this.health += nutrition;
            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }
        // This is the moment of eating!
        if (closest != null) {
            return this.seek(closest);
        }
        return sv.createVector(0, 0);
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
        var angle = this.velocity.heading() + sv.PI / 2;

        sv.push();
        sv.translate(this.position.x, this.position.y);
        sv.rotate(angle);

        if (showPerception.checked) {
            sv.strokeWeight(1);
            sv.stroke(0, 255, 0, 100);
            sv.noFill(); 
            //line(0, 0, 0, -this.dna[0] * 25);
            sv.strokeWeight(1);
            sv.ellipse(0, 0, this.dna[2] * 2);
            sv.stroke(255, 0, 0, 100);
            sv.drawingContext.setLineDash([2,2]);
            //line(0, 0, 0, -this.dna[1] * 25);
            sv.ellipse(0, 0, this.dna[3] * 2);
        }

        var gr = sp.color(0, 255, 0);
        var rd = sp.color(0, 50, 0);
        var col = sp.lerpColor(rd, gr, this.health);

        sv.fill(col);
        sv.stroke(col);
        sv.strokeWeight(1);
        sv.beginShape();
        sv.vertex(0, -this.r * 2);
        sv.vertex(-this.r, this.r * 2);
        sv.vertex(this.r, this.r * 2);
        sv.endShape(sv.CLOSE);

        sv.pop();
    }


    this.boundaries = function() {
        var d = 25;
        var desired = null;

        if (this.position.x < d) {
            desired = sv.createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > sv.width - d) {
            desired = sv.createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = sv.createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > sv.height - d) {
            desired = sv.createVector(this.velocity.x, -this.maxspeed);
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