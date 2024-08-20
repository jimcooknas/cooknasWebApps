/*
----- Coding Tutorial by Patt Vira ----- 
Name: Basics of Particle Systems
Video Tutorial: https://youtu.be/QlpadcXok8U

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/


let ps = []; 
let numToGenerate = 0;

let particlesNum = 50;
let lifeDecrease = 3;
let particleRadius = 2;
let followRandom = false;

function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight-70);
    canvas.parent(document.getElementById("canvasDiv"))
    colorMode(HSB, 255);
}

function draw() {
    background(0);
    
    if(numToGenerate>0){
        ps.push(new System(lastMouseX, lastMouseY));
        numToGenerate--;
    }

    if(followRandom){
        let x = canvas.width/2 * noise(0.003 * frameCount);
        let y = canvas.height/2 * noise(0.003 * frameCount + 10000);
        ps.push(new System(x, y));
    }else{
        if(mouseX>0 && mouseX<canvas.width && mouseY>0 && mouseY<canvas.height){
            if (abs(pmouseX - mouseX) > 0 || abs(pmouseY - mouseY) > 0) {
                ps.push(new System(mouseX, mouseY));
            }
        }
    }
    totalParticles = 0;
    for (let i=ps.length-1; i>=0; i--) {
        ps[i].update();
        ps[i].display();
        totalParticles += ps[i].particles.length;
        if (ps[i].done) {
            ps.splice(i, 1);
        }
    }
    document.getElementById("totalParticles").textContent=totalParticles;
}

function mousePressed(){
    if(mouseX>0 && mouseX<canvas.width && mouseY>0 && mouseY<canvas.height){
        numToGenerate = 10+100*Math.random();
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function particlesNumChanged(){
    particlesNum = parseInt(document.getElementById("particlesNum").value);
    document.getElementById("particlesNumValue").textContent = "" + particlesNum;
}

function lifeDecreaseChanged(){
    lifeDecrease = parseInt(document.getElementById("lifeDecrease").value);
    document.getElementById("lifeDecreaseValue").textContent = "" + lifeDecrease;
}

function particleRadiusChanged(){
    particleRadius = parseInt(document.getElementById("particleRadius").value);
    document.getElementById("particleRadiusValue").textContent = "" + particleRadius;
}

function followRandomMove(){
    followRandom = !followRandom;
    if(followRandom)
        document.getElementById("btnRandomMove").textContent="Follow Mouse";
    else
        document.getElementById("btnRandomMove").textContent="Random Move";
}