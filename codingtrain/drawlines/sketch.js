let canvas;
//const letters = [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z];
//let springStrengthEl;
let grabTolerance = 5;

let dragger = null;
let draggerRadius = 20;
let showParticles = false;
let dragParticles = [];
//let selectingKnot = false;
//let selKnotX;
//let selKnotY;

var points = [];

let img = undefined;
let drawing = false;
let editing = false;
let selectedPointIdx = -1;
let canvasScale = 1.0;

var graph = {};
// var graph = {
//     A: { B: 1, C: 4 },       // Node A is connected to Node B with a weight of 1 and Node C with a weight of 4
//     B: { A: 1, C: 2, D: 5 }, // ... and so on for other nodes
//     C: { A: 4, B: 2, D: 1 },
//     D: { B: 5, C: 1 }
// };

// Load the image.
function preload() {
    //img = loadImage('homer1_clean_pixel.jpg');
}

function setup() {
    canvas = createCanvas(600, 600);
    var div = document.getElementsByClassName("canvasDiv")[0];
    canvas.elt.classList.add("deletable");
    canvas.parent(div);
    canvas.elt.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.pageX,
            top: e.pageY
        };
        //setPosition(origin);
        return false;
    });

}

function draw(){
    background(100);
    push();
    scale(canvasScale, canvasScale);
    if(img!=undefined){
        image(img, 0, 0, width, height);
    }
    var rad = 2;
    noFill();
    if(points.length>1){
        for(var i=1; i < points.length ; i++){
            stroke(0,0,0);
            strokeWeight(3);
            line(points[i-1].x, points[i-1].y, points[i].x, points[i].y);
            stroke(255,0,0);
            strokeWeight(2);
            circle(points[i-1].x, points[i-1].y, i - 1 == selectedPointIdx ? 2*rad : rad);
        }
    }
    if(points.length > 0 && drawing){
        stroke(0,0,0);
        strokeWeight(3);
        line(points[points.length-1].x, points[points.length-1].y, mouseX/canvasScale, mouseY/canvasScale);
        stroke(255,0,0);
        strokeWeight(2);
        circle(points[points.length-1].x, points[points.length-1].y, (points.length-1) == selectedPointIdx ? 2*rad : rad);
        circle(mouseX/canvasScale, mouseY/canvasScale, 2);
    }
    pop();
}

function mousePressed(){
    if(!drawing || mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height)return;
    points.push(createVector(mouseX/canvasScale, mouseY/canvasScale));
}

function mouseMoved(){
    if(editing){
        selectedPointIdx=-1;
        for(let i=0; i<points.length;i++){
            if(dist(mouseX/canvasScale, mouseY/canvasScale, points[i].x, points[i].y) < grabTolerance){
                selectedPointIdx = i;
            }
        }
    }
}

function mouseDragged(){
    if(editing){
        if(selectedPointIdx>-1){
            points[selectedPointIdx].x=mouseX/canvasScale;
            points[selectedPointIdx].y=mouseY/canvasScale;
        }
    }
}

function mouseWheel(e){
    if(e.delta>0)
        canvasScale -= 0.2;
    else
        canvasScale += 0.2;
    return false;
}

function keyPressed(){
    if(keyCode === ESCAPE){
        drawing = false;
        document.getElementById("drawing").textContent = "NOT drawing";
    }else if(keyCode === DOWN_ARROW){
        drawing = true;
        document.getElementById("drawing").textContent = "Drawing";
    }
}

function loadMyImage(e){
    img = loadImage('homer1_clean_pixel.jpg');
    drawing = true;
    document.getElementById("drawing").textContent = "Drawing";
}

function saveMyPoints(e){
    var lst = [];
    lst.push("[");
    for(let i=0;i<points.length;i++){
        lst.push("{ x: "+points[i].x+", y: "+points[i].y+"},");
    }
    lst.push("]");
    saveStrings(lst, "data", "txt", true);
}

function loadMyPoints(){
    loadStrings("data.txt", handleData, handleError);
}

function handleData(data){
    points = [];
    for(let i=1;i<data.length-2;i++){
        var ss = data[i];
        ss = ss.replace("{","");
        ss = ss.replace("},","");
        var s = ss.split(',');
        console.log(ss);
        console.log(s);
        var x = parseFloat(s[0].substring(3));
        var y = parseFloat(s[1].substring(3));
        points.push(createVector(x, y));
    }
}

function handleError(error){
    console.error('Oops!', error);
}

function editMyPoints(){
    if(editing){
        drawing = false;
        editing = false;
        selectedPointIdx = -1;
        document.getElementById("edit").textContent = "Edit Points";
    }else{
        drawing = false;
        editing = true;
        selectedPointIdx = -1;
        document.getElementById("edit").textContent = "Stop Edit";
    }
}


function findShortestTour(graph, start) {
    // Create an object to store the shortest distance from the start node to every other node
    let distances = {};

    // A set to keep track of all visited nodes
    let visited = new Set();

    // Get all the nodes of the graph
    let nodes = Object.keys(graph);

    // Initially, set the shortest distance to every node as Infinity
    for (let node of nodes) {
        distances[node] = Infinity;
    }
    
    // The distance from the start node to itself is 0
    distances[start] = 0;

    // Loop until all nodes are visited
    while (nodes.length) {
        // Sort nodes by distance and pick the closest unvisited node
        nodes.sort((a, b) => distances[a] - distances[b]);
        let closestNode = nodes.shift();

        // If the shortest distance to the closest node is still Infinity, then remaining nodes are unreachable and we can break
        if (distances[closestNode] === Infinity) break;

        // Mark the chosen node as visited
        visited.add(closestNode);

        // For each neighboring node of the current node
        for (let neighbor in graph[closestNode]) {
            // If the neighbor hasn't been visited yet
            if (!visited.has(neighbor)) {
                // Calculate tentative distance to the neighboring node
                let newDistance = distances[closestNode] + graph[closestNode][neighbor];
                
                // If the newly calculated distance is shorter than the previously known distance to this neighbor
                if (newDistance < distances[neighbor]) {
                    // Update the shortest distance to this neighbor
                    distances[neighbor] = newDistance;
                }
            }
        }
    }
    // Return the shortest distance from the start node to all nodes
    return distances;
}


function findShortest(){
    if(points.length < 3)return;
    graph = {};
    for(let i = 0 ; i < points.length-1 ; i++){
        var dic = {};
        for(var j=i+1; j < points.length;j++){
            dic[j] = dist(points[i].x, points[i].y, points[j].x, points[j].y);
            //console.log(points[i].x, points[j], dist(points[i], points[j]));
        }
        graph[i] = dic;
    }
    console.log(findShortestTour(graph, 0));
    //console.log(graph);
}

function dist(p1x,p1y, p2x,p2y){
    return Math.sqrt((p1x-p2x)*(p1x-p2x)+(p1y-p2y)*(p1y-p2y));
}