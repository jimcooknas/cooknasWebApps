// Maurer Rose
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/c1-maurer-rose
// https://youtu.be/4uU9lZ-HSqA
// https://editor.p5js.org/codingtrain/sketches/qa7RiptE9

let canvas;
let n = 0;
let d = 0;
let dSlider;
let nSlider;
let dValue;
let nValue;
let btn;
let animating = false;
let div;
let btnLabel = "Animate";

function setup() {
    //create canvas
    canvas = createCanvas(800, 600);
    angleMode(DEGREES);
    //create div to contain all other elements
    div = document.getElementById("main");
    canvas.parent(div);
    //create label, slider and value-label for d value
    var lblD = createSpan("d Value");
    lblD.position(5, 610);
    dSlider = createSlider(1,180,29);
    dSlider.position(60, 610);
    dSlider.size(200);
    dValue = createSpan("61");
    dValue.position(265,610);
    //create label, slider and value-label for n value
    var lblN = createSpan("n Value");
    lblN.position(canvas.width - 310, 610);
    nSlider = createSlider(1,10,5);
    nSlider.position(canvas.width - 250,610);
    nSlider.size(200);
    nValue = createSpan("5");
    nValue.position(canvas.width-30,610);
    nValue.size(30);
    //create button to animate graphics
    btn = createButton(btnLabel);
    btn.size(80);
    btn.position(canvas.width/2-40,610);
    btn.mousePressed(animate);
    //set all the above as children of div
    lblD.parent(div);
    lblN.parent(div);
    dSlider.parent(div);
    nSlider.parent(div)
    btn.parent(div);
    dValue.parent(div);
    nValue.parent(div);
}

function draw() {
    background(0);
    translate(width/2,height/2);
    stroke(255);
    if(!animating){
        d = dSlider.value();
        dValue.html(d.toString());
        n = nSlider.value();
        nValue.html(n.toString());
    }
    noFill();
    beginShape();
    strokeWeight(1);
    for (let i = 0; i < 361; i++) {
        let k = i * d;
        let r = 300 * sin(n * k);
        let x = r * cos(k);
        let y = r * sin(k);
        vertex(x, y);    
    }
    endShape();

    noFill();
    stroke(255,0,255, 255);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < 361; i++) {
        let k = i;
        let r = 300 * sin(n * k);
        let x = r * cos(k);
        let y = r * sin(k);
        vertex(x, y);    
    }
    endShape();

    if(animating){
        n += 0.001;
        d += 0.003;
    }
}

function animate(){
    if(!animating){
        d=0;
        n=0;
        animating = true;
        btnLabel="Stop";
        btn.html(btnLabel);
    }else{
        d = dSlider.value();
        n = nSlider.value();
        animating = false;
        btnLabel="Animate";
        btn.html(btnLabel);
    }
}