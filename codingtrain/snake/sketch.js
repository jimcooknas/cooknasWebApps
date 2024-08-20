// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA

let canvas;
let snake;
let rez = 30;
let food;
let w;
let h;
let useEdges = true;
let frRate = 5;
let canvasWidth = 800;
let canvasHeight = 560;

let slider;
let appleImg;
let isRunning;

function preload(){
    appleImg = new Image();
    appleImg = loadImage("apple.png");
}

function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.getElementById("canvasDiv"));
    slider = document.getElementById("rezRange");
    slider.addEventListener("input", function(e){
        rez = parseInt(slider.value);
        w = floor(canvasWidth / rez);
        h = floor(canvasHeight / rez);
        resizeCanvas(w * rez, h * rez);
        snake = new Snake();
        foodLocation();
        document.getElementById("rezLabel").innerHTML = "Resolution <b>"+rez+"</b>";
    });
    w = floor(canvasWidth / rez);
    h = floor(canvasHeight / rez);
    resizeCanvas(w * rez, h * rez);
    frameRate(frRate);
    snake = new Snake();
    foodLocation();
    isRunning = true;
}

function foodLocation() {
    let x = floor(random(w));
    let y = floor(random(h));
    food = createVector(x, y);
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        if(!(snake.xdir==1 && snake.ydir==0))snake.setDir(-1, 0);
    } else if (keyCode === RIGHT_ARROW) {
        if(!(snake.xdir==-1 && snake.ydir==0))snake.setDir(1, 0);
    } else if (keyCode === DOWN_ARROW) {
        if(!(snake.xdir==0 && snake.ydir==-1))snake.setDir(0, 1);
    } else if (keyCode === UP_ARROW) {
        if(!(snake.xdir==0 && snake.ydir==1))snake.setDir(0, -1);
    } else if (key == ' ') {
        snake.grow();
    }else if (key == 'p') {
        if(isRunning){
            isRunning = false;
            document.getElementById("paused").textContent = "Paused";
            noLoop();
        }else{
            isRunning = true;
            document.getElementById("paused").textContent = "";
            loop();
        }
    }
}

function draw() {
    scale(rez);
    background(255);
    for(let i = 1; i < w; i++){
        for(let j = 1; j < h; j++){
            stroke(240);
            strokeWeight(2/rez);
            line(0, j, w, j);
            line(i, 0, i, h);
        }
    }
    if (snake.eat(food)) {
        foodLocation();
        if(snake.body.length % 10 == 0){
            frRate++;
            frameRate(frRate);
        }
    }
    snake.update();
    snake.show();

    if (snake.endGame()) {
        print("END GAME");
        push();
        scale(1/rez);
        background(255, 0, 0);
        textSize(28);
        fill(255);
        stroke(0);
        strokeWeight(2);
        //textAlign(CENTER);
        text("END GAME", 330, 290);
        pop();
        noLoop();
    }

    noStroke();
    //fill(255, 0, 0);
    //circle(food.x+0.5, food.y+0.5, 1);
    image(appleImg, food.x, food.y, 1, 1);
}

function onEdgeChanged(){
    useEdges = document.getElementById("checkbox").checked;
    console.log(useEdges);
}

function newGame(){
    rez = parseInt(slider.value);
    w = floor(canvasWidth / rez);
    h = floor(canvasHeight / rez);
    resizeCanvas(w * rez, h * rez);
    frRate = 5;
    frameRate(frRate);
    snake = new Snake();
    foodLocation();
    loop();
}