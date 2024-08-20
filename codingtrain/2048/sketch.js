// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// 2048
// https://youtu.be/JSn-DJU8qf0
// https://youtu.be/8f8P1i0W26E
// https://youtu.be/3iYvT8TBIro
// https://youtu.be/vtMKeEGpMI4

let div;
let canvas;
let grid;
let grid_new;
let score = 0;
let pointerX;
let pointerY;
let mouseDown=false;
let msgEl;

function setup() {
    canvas = createCanvas(420, 420);
    div = document.getElementById("main");
    canvas.parent(div);

    noLoop();
    grid = blankGrid();
    grid_new = blankGrid();
    // console.table(grid);
    addNumber();
    addNumber();
    updateCanvas();
    var scoreEl = document.getElementById("scoreDiv");
    //scoreEl.parent(div);
    //scoreEl.style.display="flex";
    scoreEl.style.width="420px";
    //scoreEl.style.textAlign="justify";
    msgEl = createSpan("Left-Right-Up-Down");
    msgEl.position(0,522);
    msgEl.size(420, 60);
    msgEl.style('font-size','24px');
    msgEl.style('text-align','center');
    msgEl.style('align-content','center');
    msgEl.style('background-color','#d6d6d6');
    msgEl.parent(div);
}

// One "move"
function keyPressed() {
    let flipped = false;
    let rotated = false;
    let played = true;
    switch (keyCode) {
        case DOWN_ARROW:
            // do nothing
            msgEl.html("Down");
            break;
        case UP_ARROW:
            grid = flipGrid(grid);
            flipped = true;
            msgEl.html("Up");
            break;
        case RIGHT_ARROW:
            grid = transposeGrid(grid);
            rotated = true;
            msgEl.html("Right");
            break;
        case LEFT_ARROW:
            grid = transposeGrid(grid);
            grid = flipGrid(grid);
            rotated = true;
            flipped = true;
            msgEl.html("Left");
            break;
        default:
            played = false;
    }

    if (played) {
        let past = copyGrid(grid);
        for (let i = 0; i < 4; i++) {
            grid[i] = operate(grid[i]);
        }
        let changed = compare(past, grid);
        if (flipped) {
            grid = flipGrid(grid);
        }
        if (rotated) {
            grid = transposeGrid(grid);
        }
        if (changed) {
            addNumber();
        }
        updateCanvas();

        let gameover = isGameOver();
        if (gameover) {
            console.log("GAME OVER");
            msgEl.html("GAME OVER");
            msgEl.style('font-size','36px');
            msgEl.style('font-weight','bold');
            msgEl.style('color','red');
        }

        let gamewon = isGameWon();
        if (gamewon) {
            console.log("GAME WON");
            msgEl.html("You have WON");
            msgEl.style('font-size','36px');
            msgEl.style('font-weight','bold');
            msgEl.style('color','green');
        }

    }
}

function updateCanvas() {
    background(255);
    drawGrid();
    select('#score').html(score);
}

function drawGrid() {
    background(255);
    let w = 100;
    let gridMark = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            noFill();
            strokeWeight(2);
            let val = grid[i][j];
            let s = val.toString();
            if (grid_new[i][j] === 1) {
                //stroke(200, 0, 200);
                //strokeWeight(8);
                strokeWeight(4);
                stroke(0);
                grid_new[i][j] = 0;
                gridMark.push([i,j]);
            } else {
                strokeWeight(4);
                stroke(0);
            }

            if (val != 0) {
                fill(colorsSizes[s].color);
            } else {
                noFill();
            }
            rect(10 + i * w, 10 + j * w, w, w, 20);
            if (val !== 0) {
                textAlign(CENTER, CENTER);
                noStroke();
                fill(0);
                textSize(colorsSizes[s].size);
                text(val, 10 + i * w + w / 2, 10 + j * w + w / 2);
            }
        }
    }
    for(let i=0;i<gridMark.length;i++){
        stroke(200, 0, 0, 150);
        strokeWeight(16);
        noFill();
        rect(10 + gridMark[i][0] * w, 10 + gridMark[i][1] * w, w, w, 20);
    }
}

function mousePressed(){
    pointerX=mouseX;
    pointerY=mouseY;
    mouseDown = true;
}

function mouseReleased(){
    mouseDown = false;
}

function mouseDragged(){
    if(mouseDown){
        let newX = mouseX;
        let newY = mouseY;
        let diffX = mouseX-pointerX;
        let diffY = mouseY-pointerY;
        if(abs(diffX)>20 || abs(diffY)>20){
            if(abs(diffX) > abs(diffY)){
                if(diffX>0)
                    keyCode = RIGHT_ARROW;
                else
                    keyCode = LEFT_ARROW;
            }else{
                if(diffY>0)
                    keyCode = DOWN_ARROW;
                else
                    keyCode = UP_ARROW;
            }
            keyPressed();
        }
    }

}
