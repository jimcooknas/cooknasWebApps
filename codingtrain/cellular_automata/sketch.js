// Wolfram Elementary CA
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/179-wolfram-ca
// https://youtu.be/Ggxt06qSAe4

/** The canvas of p5.js to draw on */
var canvas;
/** list of all passed cell-lines */
let history = [];
/** Array to store the state of each cell. */
let cells = [];
/**  Rule value */
let ruleValue = 90;
/** The ruleset string */ 
let ruleSet;
/**  Width of each cell in pixels */
let w = 10;
/**  y-position */
let y = 0;
/** the slider keeping the startin X point  */
let xStartEl;
/** the starting x point of the automata */
let xStart;
/** the starting rule when cycling paterns */
let startRule = 0;
/** the palette used when coloring cellular automata*/
let palette = [];
/** if you let screen scroll during new cells generationd */
let scrollCells = false;
/** Checkbox to set the scrolling behavior on screen of automata */
let scrollCellsEl;
/** if the main loop is running or not */
let isRunning = true;



function setup() {
    var panelWidth = document.getElementsByClassName("info")[0].style.width;
    canvas = createCanvas(windowWidth-280, 0.95*windowHeight);
    //remove contextmenu of browser when clicking right-mouse button
    canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.parent(document.getElementById("canvasCell"));
    scrollCellsEl = document.getElementById("scrollCells");
    getCellWidth();
    getRuleValue();
    xStartEl = document.getElementById("rangeStartX");
    xStartEl.min=0;
    // Calculate the total number of cells based on canvas width.
    let total = floor(width / w);
    xStartEl.max = total;
    xStartEl.value = floor(total/2)
    xStart = parseInt(xStartEl.value);
    // Convert the rule value to a binary string.
    ruleSet = ruleValue.toString(2).padStart(8, "0");
    // Initialize all cells to state 0 (inactive).
    for (let i = 0; i < total; i++) {
        cells[i] = 0;
    }
    // Set the cell at position xStart to state 1 (active) as the initial condition.
    cells[xStart] = 1;
    background(255);
}

function draw() {
    history.push(cells);

    let cols = height / w;
    if (history.length > cols + 1) {
        history.splice(0, 1);
    }

    if(scrollCells){
        let y = 0;
        background(255);
        for (let cells of history) {
            for (let i = 0; i < cells.length; i++) {
            let x = i * w;
                if (cells[i] == 1) {
                    noStroke();
                    fill(0);
                    square(x, y - w, w);
                }
            }
            y += w;
        }
     } else {
        // Draw each cell based on its state.
        for (let i = 0; i < cells.length; i++) {
            let x = i * w;
            noStroke();
            fill(255 - cells[i] * 255);
            square(x, y, w);
        }

        // Move to the next row.
        y += w;
    }
    // Prepare an array for the next generation of cells.
    let nextCells = [];
    // Iterate over each cell to calculate its next state.
    let len = cells.length;
    for (let i = 0; i < len; i++) {
        // Calculate the states of neighboring cells
        let left = cells[(i - 1 + len) % len];
        let right = cells[(i + 1) % len];
        let state = cells[i];
        // Set the new state based on the current state and neighbors.
        let newState = calculateState(left, state, right);
        nextCells[i] = newState;
    }

    // Update the cells array for the next generation.
    cells = nextCells;
}

/** Calculates the state of the next generation of a cell (b) given its neibours (a, c)*/
function calculateState(a, b, c) {
    // Create a string representing the state of the cell and its neighbors.
    let neighborhood = "" + a + b + c;
    // Convert the string to a binary number
    let value = 7 - parseInt(neighborhood, 2);
    // Return the new state based on the ruleset.
    return parseInt(ruleSet[value]);
}


function getCellWidth(){
    w = parseInt(document.getElementById("rangeWidth").value);
    document.getElementById("rangeWidthValue").textContent = w.toString();
    if(w==0)w=1;
    document.getElementById("colsrows").textContent = floor(width/w) + " x " + floor(height/w);
    document.getElementById("rangeStartX").max = floor(width/w);
}

function getRuleValue(){
    ruleValue = parseInt(document.getElementById("rangeRule").value);
    document.getElementById("rangeRuleValue").textContent = ruleValue.toString();
    var str = ruleValue.toString(2);
    str = "0".repeat(8-str.length)+str;
    document.getElementById("ruleBinValue").textContent = str;
}

function getStartPosX(){
    xStart = parseInt(document.getElementById("rangeStartX").value);
    document.getElementById("rangeStartXValue").textContent = xStart.toString();
}

function setToMiddle(){
    document.getElementById("rangeStartX").value = floor((width/w)/2);
    getStartPosX();
}

function scrollClick(){

    if(scrollCellsEl.checked){
        scrollCells = scrollCellsEl.checked
    }else{
        scrollCells = scrollCellsEl.checked
    }
}

function showInstructions(){
    document.getElementById("wolfram").style.display = "block";
    // WolframNotebookEmbedder.embed("ElementaryCellularAutomaton.nb", 
    //     document.getElementById("wolfram"), {
    //         allowInteract: true,
    //         read: true,
    //     },
    // );
}

function closeInstructions(){
    document.getElementById("wolfram").style.display = "none";
}

function newAutomata(){
    if(isRunning){
        isRunning = false;
        noLoop();
        document.getElementById("runAutomata").value = "Start Automata";
    }else{
        history = [];
        // Convert the rule value to a binary string.
        ruleSet = ruleValue.toString(2).padStart(8, "0");

        // Calculate the total number of cells based on canvas width.
        let total = width / w;
        // Initialize all cells to state 0 (inactive).
        for (let i = 0; i < total; i++) {
            cells[i] = 0;
        }
        // Set the middle cell to state 1 (active) as the initial condition.
        //xStart = floor(total / 2);
        cells[xStart] = 1;
        y = 0;
        background(255);
        document.getElementById("runAutomata").value = "Stop Automata";
        isRunning = true;
        loop();
    }
}
