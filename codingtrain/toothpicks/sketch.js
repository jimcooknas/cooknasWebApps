// Toothpicks
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/126-toothpicks.html
// https://youtu.be/-OL_sw2MiYw

let picks = [];

let len = 53;

let minX;
let maxX;
let goOn = false;
let runContinuous = false;
let count=0;
let maxSteps = 200;
let useHSL = false;

function setup() {
    var canvas = createCanvas(windowHeight*0.95, windowHeight*0.95);
    canvas.parent(document.getElementById("canvasDiv"));
    minX = -width / 2;
    maxX = width / 2;
    picks.push(new Toothpick(0, 0, 1));
}

function draw() {
    background(470);
    translate(width / 2, height / 2);
    let factor = float(width) / (maxX - minX);
    scale(factor);
    for (let t of picks) {
        t.show(factor);
        minX = min(t.ax, minX);
        maxX = max(t.ax, maxX);
    }
    if(goOn || runContinuous){
        let next = [];
        for (let t of picks) {
            if (t.newPick) {
                let nextA = t.createA(picks);
                let nextB = t.createB(picks);
                if (nextA != null) {
                    next.push(nextA);
                }
                if (nextB != null) {
                    next.push(nextB);
                }
                t.newPick = false;
            }
        }
        count++;
        

        picks = picks.concat(next);
        if (count >= maxSteps) {
            noLoop(); 
        }
        goOn = false;
    }
    document.getElementById("stepNo").textContent = count;
    document.getElementById("toothpicks").textContent = picks.length;
}

function mousePressed(){
    if(mouseX>0 && mouseX<width && mouseY>0 && mouseY<height){
        console.log("Clicked");
        goOn=true;
    }
}

function continousChanged(){
    runContinuous = document.getElementById("runContinoulsy").checked;
    if(runContinuous){
        document.getElementById("nextStep").disabled = true;
    }else{
        document.getElementById("nextStep").disabled = false;
    }
}

function nextStepClicked(){
    goOn=true;
}

function runagain(){
    picks = [];
    minX = -width / 2;
    maxX = width / 2;
    goOn = false;
    runContinuous = document.getElementById("runContinoulsy").checked;
    count=0;
    picks.push(new Toothpick(0, 0, 1));
    loop();
}

function maxStepsChanged(){
    maxSteps = parseInt(document.getElementById("maxSteps").value);
    console.log(maxSteps);
}

function useHSLChanged(){
    useHSL = document.getElementById("useHSL").checked;
}