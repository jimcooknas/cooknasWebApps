// Coding Challenge 127: Brownian Motion Snowflake
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/127-brownian-snowflake.html
// https://youtu.be/XUA8UREROYE

let current;
let snowflake = [];
let completed = false;
let phase = 0;
let spread = 3;
let dRotate = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  current = new Particle(0.95*height/2, 0, spread);
}

function draw() {
    translate(width/2, height/2);
    rotate(PI/6);
    background(0);
    if(completed){
        phase += dRotate;
        rotate(phase);
        for (let i = 0; i < 6; i++) {
            rotate(PI/3);
            current.show();
            for (let p of snowflake) {
                p.show();
            }
            push();
            scale(1, -1);
            current.show();
            for (let p of snowflake) {
                p.show();
            }
            pop();
        }
    }else{
        phase += dRotate;
        rotate(phase);
        let count = 0;
        while (!current.finished() && !current.intersects(snowflake)) {
            current.update();
            count++;
        }

        // If a particle doesn't move at all we're done
        // This is an exit condition not implemented in the video
        if (count == 0) {
            //noLoop();
            completed=true;
            console.log('snowflake completed');
            document.getElementById("result").textContent = "Snowflake completed";
        }

        snowflake.push(current);
        current = new Particle(0.95*height/2, 0, spread);

        for (let i = 0; i < 6; i++) {
            rotate(PI/3);
            current.show();
            for (let p of snowflake) {
                p.show();
            }

            push();
            scale(1, -1);
            current.show();
            for (let p of snowflake) {
                p.show();
            }
            pop();
        }
        document.getElementById("particles").textContent = (6*snowflake.length).toString();
    }
}

function spreadRangeChanged(){
    spread = parseInt(document.getElementById("spreadRange").value);
    document.getElementById("spreadRangeVal").textContent = spread;
}

function rotateRangeChanged(){
    dRotate = parseFloat(document.getElementById("rotateRange").value/1000);
    document.getElementById("rotateRangeVal").textContent = dRotate.toFixed(3);
}

function restart(){
    current = undefined;
    snowflake = [];
    completed = false;
    phase = 0;
    document.getElementById("result").textContent = "";
    spread = parseInt(document.getElementById("spreadRange").value);
    dRotate = parseFloat(document.getElementById("rotateRange").value/1000);
    current = new Particle(0.95*height/2, 0, spread);
}