// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgAl

let typeOfGraph = 1;//1=fourier-series 2=DFT drawing
let drawingType = 4;
let ctx;
//common variables
let time = 0;
let path = [];
let pathTotal = [];
let drawTotal = false;
//variables for fourier-series
let wave = [];
let centerX = 300;
let centerY = 300;
let radCoeff = 150;
let graphPoints = 350;
//variables for DFT drawing
let x = [];
let y = [];
let fourierX;
let fourierY;
let mypoints = [];
let isMouseDraw = false;

//controls and elements
let canvas;
let circNumSlider;
let speedSlider;
let typeOfGraphRadio;
let drawingTypeRadio;
var drawingTypeDiv;

function initDFT(){
    var skip = 8;
    time = 0;
    path = [];
    x = [];
    y = [];
    if(drawingType==1){
        scale=1;
        for (let i = 0; i < drawing.length; i += skip) {
            x.push(scale * drawing[i].x);
            y.push(scale * drawing[i].y);
        }
    }else if(drawingType==2){
        scale=0.4;
        skip=6;
        for (let i = 0; i < dragon.length; i += skip) {
            x.push(scale * dragon[i].x);
            y.push(scale * dragon[i].y);
        }
    }else if(drawingType==3){
        scale=0.7;
        skip=1;
        for (let i = 0; i < homer.length-2; i += skip) {
            x.push(scale * homer[i].x-200);
            y.push(scale * homer[i].y-200);
        }
    }else{
        scale = 1;
        skip = 1;
        if(mypoints.length>0){
            for (let i = 0; i < mypoints.length; i += skip) {
                x.push(scale * (mypoints[i].x - width / 2 - 100));
                y.push(scale * (mypoints[i].y - height / 2 - 50));
            }
        }
    }
    if(x.length>0 && y.length>0){
        fourierX = dft(x);
        fourierY = dft(y);

        fourierX.sort((a, b) => b.amp - a.amp);
        fourierY.sort((a, b) => b.amp - a.amp);
        loop();
    }
}

function initFourierSeries(){
    time = 0;
    path = [];
    wave = [];
    loop();
}

function setup() {
    var canvas = createCanvas(1000, 600);
    ctx = canvas.elt.getContext("2d");
    var circNumDiv = document.getElementById("circNumDiv");
    circNumSlider = createSlider(1, 50, 5);
    circNumSlider.input(circNumChanged);
    circNumSlider.parent(circNumDiv);
    var speedDiv = document.getElementById("speedDiv");
    speedSlider = createSlider(1,50,25);
    speedSlider.input(speedChanged);
    speedSlider.parent(speedDiv);
    var typeOfGraphDiv = document.getElementById("typeOfGraphDiv");
    drawingTypeDiv = document.getElementById("drawingTypeDiv");

    typeOfGraphRadio = createRadio();
    typeOfGraphRadio.size(120);
    var fsLabel = typeOfGraphRadio.option("Fourier Series");
    fsLabel.title="Fourier Series";
    var dftLabel = typeOfGraphRadio.option("DFT Drawing");
    dftLabel.title="Discrete Fourier Transormation";
    typeOfGraph = 1;
    typeOfGraphRadio.input(typeOfGraphChanged);
    typeOfGraphRadio.selected("Fourier Series");
    typeOfGraphRadio.parent(typeOfGraphDiv);
    
    drawingTypeRadio = createRadio();  
    drawingTypeRadio.size(210);
    drawingTypeRadio.option("Coding train");
    drawingTypeRadio.option("Dragon draw");
    drawingTypeRadio.option("Homer");
    drawingTypeRadio.option("Mouse draw");

    drawingTypeRadio.selected("Mouse draw");
    drawingTypeRadio.add
    drawingType = 4;
    drawingTypeRadio.input(drawingTypeChanged);
    drawingTypeRadio.parent(drawingTypeDiv);
    if(typeOfGraphRadio.value()=="Fourier Series"){
        typeOfGraph = 1;
        drawingTypeDiv.style.display = "none";
    }else{
        typeOfGraph = 2;
        drawingTypeDiv.style.display = "block";
    }
    if(typeOfGraph==1)initFourierSeries();
    else if(typeOfGraph==2)initDFT();
}

function epiCycles(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;
        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);
    
        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);
        stroke(255,0,0);
        line(prevx, prevy, x, y);
        fill(255,255,0)
        noStroke();
        ellipse(x, y, 5);
    }
    return createVector(x, y);
}

function draw() {
    frameRate(speedSlider.value());
    background(0);
    if(isMouseDraw){
        background(0);
        fill(255);
        textSize(20);
        noStroke();
        text("Draw on canvas with the mouse (click and drag to draw a path)", 200, 20);
        if(mypoints.length>0){
            stroke(255);
            for(let i=1;i<mypoints.length;i++){
                line(mypoints[i-1].x, mypoints[i-1].y, mypoints[i].x, mypoints[i].y)
            }
        }
        return;
    }
    if(typeOfGraph == 1){//Fourier Series
        translate(centerX, centerY);
        let x = 0;
        let y = 0;
        var maxCircles = circNumSlider.value();
        var m = maxCircles*2+1;
        textSize(16);
        fill(255);
        noStroke();
        text("4sin(θ)/π + ... + 4sin(m*θ)/(m*π)  where  m = 2 * n +1 = "+m, 250, -250);
        for (let i = 0; i < maxCircles; i++) {
            let prevx = x;
            let prevy = y;

            let n = i * 2 + 1;
            let radius = radCoeff * (4 / (n * PI));
            x += radius * cos(n * time);
            y += radius * sin(n * time);

            stroke(255, 255, 255, 55 + i * 200 / maxCircles);
            noFill();
            ellipse(prevx, prevy, radius * 2);

            stroke(255, 0, 0);
            line(prevx, prevy, x, y);
            fill(255,255,0)
            noStroke();
            ellipse(x, y, 5);
        }
        wave.unshift(y);
        translate(graphPoints, 0);
        stroke(255, 255, 255);
        strokeWeight(0.4);
        line(x - graphPoints, y, 0, wave[0]);
        beginShape();
        strokeWeight(2);
        noFill();
        for (let i = 0; i < wave.length; i++) {
            vertex(i, wave[i]);
        }
        endShape();
        time += 0.05;
        if (wave.length > graphPoints) {
            wave.pop();
        }
    }else if(typeOfGraph==2){//Discrete Fourier Transormation
        textSize(12);
        noStroke();
        fill(255);
        text("Epicycles X: "+fourierX.length, 10, height-20);
        text("Epicycles Y: "+fourierY.length, width-100, 20);
        let vx = epiCycles(width / 2 + 100, 50, 0, fourierX);
        let vy = epiCycles(100, height / 2 + 50, HALF_PI, fourierY);
        let v = createVector(vx.x, vy.y);
        path.unshift(v);
        stroke(255, 255, 255);
        strokeWeight(0.4);
        line(vx.x, vx.y, v.x, v.y);
        line(vy.x, vy.y, v.x, v.y);

        if(drawTotal){
            beginShape();
            noFill();
            strokeWeight(2);
            stroke(125, 125, 0);
            for (let i = 0; i < pathTotal.length-1; i++) {
                vertex(pathTotal[i].x, pathTotal[i].y);
            }
            endShape();
        }
        beginShape();
        noFill();
        strokeWeight(2);
        stroke(255);
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();

        const dt = TWO_PI / fourierY.length;
        time += dt;

        if (time >= TWO_PI) {
            time = 0;
            path.pop();
            pathTotal = path;
            pathTotal.pop();
            //console.log(pathTotal);
            path = [];
            drawTotal = true;
        }
    }
}

function mousePressed(){
    if(drawingType==4 && mouseY>0 && isMouseDraw){
        mypoints = [];
    }
}

function mouseDragged(){
    if(drawingType==4 && isMouseDraw){
        mypoints.push({x:mouseX, y:mouseY});
    }
    beginShape();
    strokeWeight(2);
    noFill();
    for (let i = 0; i < mypoints.length; i++) {
        vertex(mypoints[i].x, mypoints[i].y);
    }
    endShape();
}

function mouseReleased(){
    if(drawingType==4 && mouseY>0 && isMouseDraw){
        mypoints.push(mypoints[0]);
        isMouseDraw = false;
        initDFT();
        loop();
    }
}

function typeOfGraphChanged(){
    if(typeOfGraphRadio.value()=="Fourier Series"){
        typeOfGraph = 1;
        drawingTypeDiv.style.display = "none";
        document.getElementById("circDiv").style.display="block";
        isMouseDraw = false;
    }else{
        typeOfGraph = 2;
        drawingTypeDiv.style.display = "block";
        document.getElementById("circDiv").style.display="none";
        pathTotal = [];
        drawTotal = false;
        if(drawingType == 4){
            isMouseDraw = true;
            mypoints = [];
        }
    }
    //console.log("typeOfGraph="+typeOfGraph);
    if(typeOfGraph==1)initFourierSeries();
    else if(typeOfGraph==2)initDFT();
}

function drawingTypeChanged(){
    if(drawingTypeRadio.value() == "Coding train"){
        drawingType = 1;
        pathTotal = [];
        drawTotal = false;
        //console.log("drawingType="+drawingType);
        isMouseDraw = false;
        initDFT();
    }else if(drawingTypeRadio.value() == "Dragon draw"){
        drawingType = 2;
        pathTotal = [];
        drawTotal = false;
        //console.log("drawingType="+drawingType);
        isMouseDraw = false;
        initDFT();
    }else if(drawingTypeRadio.value() == "Homer"){
        drawingType = 3;
        pathTotal = [];
        drawTotal = false;
        //console.log("drawingType="+drawingType);
        isMouseDraw = false;
        initDFT();
    }else{
        drawingType = 4;
        typeOfGraph=2;
        isMouseDraw = true;
        mypoints = [];
        pathTotal = [];
        drawTotal = false;
    }
}


function circNumChanged(){
    document.getElementById("circNumVal").textContent = circNumSlider.value();
}

function speedChanged(){
    document.getElementById("speedVal").textContent = speedSlider.value();
}