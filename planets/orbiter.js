class Orbiter {
    constructor(centerOfOrbit, planetName,  sizeRadius, orbitRadius, hasRings = false, orbitAngle = 0) {
        this.centerOfOrbit=centerOfOrbit;
        this.planetName = planetName;
        this.sizeRadius = sizeRadius;
        this.hasRings = hasRings;
        this.orbitRadius = orbitRadius;
        this.orbitAngle = orbitAngle;
         // degrees relative to x axis
        // 2000 is an arbitrary animation speed (which also depends on the frame rate)
        // The -1.5 exponent is due to Kepler's 3rd Law
        this.orbitAngleDelta = 2000 * Math.pow(orbitRadius, -1.5);
        if(centerOfOrbit!=null){
            this.x = this.centerOfOrbit.x + this.orbitRadius * cos(radians(this.orbitAngle));
            this.y = this.centerOfOrbit.y + this.orbitRadius * sin(radians(this.orbitAngle));
        }else{
            this.x=this.y=0;
        }
        this.color = 'white';
        this.history = [];
        this.pathLen = 0;
        this.counter=0;
    }

    orbit(primary) {
        if(this.centerOfOrbit!=null){
            if(this.counter % 2 == 0)
                this.history.push(createVector(this.x, this.y));
            else if(this.planetName=="Moon")this.history.push(createVector(this.x, this.y));
            this.x = this.centerOfOrbit.x + this.orbitRadius * cos(radians(this.orbitAngle));
            this.y = this.centerOfOrbit.y + this.orbitRadius * sin(radians(this.orbitAngle));
            this.orbitAngle = (this.orbitAngle + this.orbitAngleDelta) % 360;
            if(this.pathLen >= TWO_PI * this.orbitRadius)
                this.history.splice(0,1);
            this.counter++;
        }
    }

    display() {
        fill(this.color);
        stroke(this.color);
        strokeWeight(1);
        if(drawTail){
            if(this.history.length > 1){
                var r = red(this.color);
                var g = green(this.color);
                var b = blue(this.color);
                this.pathLen=0;
                for(var i = 1; i < this.history.length; i++){
                    var a = map(i, 1, this.history.length, 1, 255);
                    stroke(r, g, b, a);
                    line(this.history[i-1].x, this.history[i-1].y, this.history[i].x, this.history[i].y);
                    this.pathLen += dist(this.history[i-1].x, this.history[i-1].y, this.history[i].x, this.history[i].y);
                }
                line(this.history[this.history.length-1].x, this.history[this.history.length-1].y, this.x, this.y);
                this.pathLen += dist(this.history[this.history.length-1].x, this.history[this.history.length-1].y, this.x, this.y);
            }else{/*console.log(this.planetName+" history length = 0");*/}
        }
        noStroke();
        if(drawName){
            textSize(10);
            text(this.planetName, this.x + this.sizeRadius + 2, this.y + 5);
        }
        if(this.hasRings){
            noFill();
            stroke(red(this.color),green(this.color),blue(this.color), 100);
            strokeWeight(2);
            ellipse(this.x, this.y, 1.5*this.sizeRadius, 1.5*this.sizeRadius);
        }
        fill(this.color);
        ellipse(this.x, this.y, this.sizeRadius, this.sizeRadius);
        return; 
    }
}