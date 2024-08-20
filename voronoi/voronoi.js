// Coding Train / Daniel Shiffman
// Weighted Voronoi Stippling
// https://thecodingtrain.com/challenges/181-image-stippling

//context
//let context;
var MAX_WIDTH = 600;
var MAX_HEIGHT = 500;
var relaxIndex = 0.01;
// All of the points
let points = [];
// Global variables for geometry
let delaunay, voronoi;
// Image
let gloria;
let dropzone;
let dropzoneEl;
//show lines 
let bShowPoints = true;
let bShowVoronoi = false;
let bShowTriangles = false;
let isFirstTime=true;
let images = [];

function appendScript(){
    try{
        let php = document.createElement("script");
        php.setAttribute("src", "dir.php");
        document.body.appendChild(php);
    }catch(e){
        alert("No php extension is running.");
    }
}

function callback(files) {
    images=[];
    var op1 = document.createElement("option");
    op1.value="import";
    op1.text="Import";
    document.getElementsByName("select-type")[0].appendChild(op1);
    var op4 = document.createElement("option");
    op4.value="random";
    op4.text="Random";
    document.getElementsByName("select-type")[0].appendChild(op4);
    var op2 = document.createElement("option");
    op2.value="dog";
    op2.text="Dog";
    op2.selected=true;
    document.getElementsByName("select-type")[0].appendChild(op2);
    var op3 = document.createElement("option");
    op3.value="neo";
    op3.text="Neo";
    document.getElementsByName("select-type")[0].appendChild(op3);
    for(let f of files){
        images.push(f);
        op = document.createElement("option");
        op.value=f;
        op.text=f;
        document.getElementsByName("select-type")[0].appendChild(op);
    }
}

// Load image before setup
function preload() {
    gloria = loadImage("gloria_pickle.jpg");
}

function setup() {
    bShowPoints = true;
    bShowVoronoi = false;
    bShowTriangles = false;
    isFirstTime=true;
    var canvas = createCanvas(MAX_WIDTH, MAX_HEIGHT);
    canvas.parent('container');
    
    //set the select element options
    appendScript();
    //resizeCanvas
    resizeCanvas(gloria.width, gloria.height);
    // Generate random points avoiding bright areas
    generateRandomPoints(6000);

    // Calculate Delaunay triangulation and Voronoi diagram
    delaunay = calculateDelaunay(points);
    voronoi = delaunay.voronoi([0, 0, width, height]);
    dropzoneEl = document.getElementsByClassName("dropzone-container")[0];
    dropzone = new Dropzone("div.my-dropzone",{
        //headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        autoProcessQueue: true, 
        maxFilesize: 2, 
        addRemoveLinks: true,
        uploadMultiple: false,
        url:"uploadfile.php",//http://"+window.location.hostname+"/voronoi/
        success: function(file, response){
            var imgName=response;
            file.previewElement.classList.add("dz-success");
            file.previewElement.classList.remove("dz-error");
            gloria = loadImage("./files/"+response, ImageLoaded);
        },
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
            file.previewElement.classList.remove("dz-success");
            console.log("Error uploading '"+response+"'");
        },
    });
    dropzone.on("removedfile", file =>{
        console.log("Removed file "+file.name);
    });
    dropzoneEl.style.display="hidden";
}

function draw() {
    background(255);
    
    if(!bShowPoints)
        image(gloria, 0, 0);

    if(bShowTriangles)
        //display triangles of triangulation
        displayTriangles();

    if(bShowVoronoi)
        //display voronoi diagram
        displayVoronoi();

    if(bShowPoints)
        // Display points
        displayPoints();
    
    // Calculate centroids and update points
    updatePoints();
}

// Generate random points avoiding bright areas
function generateRandomPoints(n) {
    for (let i = 0; i < n; i++) {
        let x = random(width);
        let y = random(height);
        let col = gloria.get(x, y);
        if (random(100) > brightness(col)) {
            points.push(createVector(x, y));
        } else {
            i--;
        }
    }
}

// Display points
function displayPoints() {
    for (let v of points) {
        stroke(0);
        strokeWeight(4);
        point(v.x, v.y);
    }
}

//Display Voronoi
function displayVoronoi(){
    stroke(0, 165, 255);
    strokeWeight(1);
    let voronoi = delaunay.voronoi([0,0,width,height]);
    let polygons = voronoi.cellPolygons();
    for(let poly of polygons){
        //if(isFirstTime)console.log(poly);
        beginShape();
        for(let i=0;i<poly.length;i++){
            vertex(poly[i][0], poly[i][1]);
        }
        endShape();
    }
    isFirstTime=false;
}

//Display Triangles
function displayTriangles(){
    const {delpoints, triangles} = delaunay;
    stroke(255, 165, 0);
    strokeWeight(1);
    //if(isFirstTime)console.log(triangles.length);
    //if(delaunay.points==undefined)return;// || triangles ==undefined)return;
    for(var i=0; i<triangles.length; i+=3){
        let a = 2 * triangles[i];
        let b = 2 * triangles[i+1];
        let c = 2 * triangles[i+2];
        triangle(
            delaunay.points[a], delaunay.points[a+1],
            delaunay.points[b], delaunay.points[b+1],
            delaunay.points[c], delaunay.points[c+1]
        );
    }
}

// Calculate centroids and update points
function updatePoints() {
    // Get latest polygons
    let polygons = voronoi.cellPolygons();
    let cells = Array.from(polygons);
    
    // Arrays for centroids and weights
    let centroids = new Array(cells.length);
    let weights = new Array(cells.length).fill(0);
    for (let i = 0; i < centroids.length; i++) {
        centroids[i] = createVector(0, 0);
    }
    
    // Get the weights of all the pixels and assign to cells
    gloria.loadPixels();
    let delaunayIndex = 0;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let index = (i + j * width) * 4;
            let r = gloria.pixels[index + 0];
            let g = gloria.pixels[index + 1];
            let b = gloria.pixels[index + 2];
            let bright = (r + g + b) / 3;
            let weight = 1 - bright / 255;
            delaunayIndex = delaunay.find(i, j, delaunayIndex);
            centroids[delaunayIndex].x += i * weight;
            centroids[delaunayIndex].y += j * weight;
            weights[delaunayIndex] += weight;
        }
    }
    
    // Compute weighted centroids
    for (let i = 0; i < centroids.length; i++) {
        if (weights[i] > 0) {
            centroids[i].div(weights[i]);
        } else {
            centroids[i] = points[i].copy();
        }
    }
    
    // Interpolate points
    for (let i = 0; i < points.length; i++) {
        points[i].lerp(centroids[i], relaxIndex);
    }
    
    // Next voronoi (relaxation)
    delaunay = calculateDelaunay(points);
    voronoi = delaunay.voronoi([0, 0, width, height]);
}

// Calculate Delaunay triangulation from p5.Vectors
function calculateDelaunay(points) {
    let pointsArray = [];
    for (let v of points) {
        pointsArray.push(v.x, v.y);
    }
    return new d3.Delaunay(pointsArray);
}

//panel's functions
function RedrawImage(){
    if(gloria.width>MAX_WIDTH)
        gloria.resize(MAX_WIDTH, 0);
    if(gloria.height>MAX_HEIGHT)
        gloria.resize(0, MAX_HEIGHT);
    resizeCanvas(gloria.width, gloria.height);
    noLoop();
    points = [];
    // Generate random points avoiding bright areas
    generateRandomPoints(document.getElementById("numberOfPoints").value);
    // Calculate Delaunay triangulation and Voronoi diagram
    delaunay = calculateDelaunay(points);
    voronoi = delaunay.voronoi([0, 0, gloria.width, gloria.height]);
    loop();
}

function run(){

}

function onShowPoints(){
    bShowPoints = document.getElementById("chkShowPoints").checked;
}

function onShowVoronoi(){
    bShowVoronoi = document.getElementById("chkShowVoronoi").checked;
    if(bShowVoronoi){
        document.getElementById("chkShowTriangle").checked = false;
        bShowTriangles = false;
    }
}

function onShowTriangle(){
    bShowTriangles = document.getElementById("chkShowTriangle").checked;
    if(bShowTriangles){
        document.getElementById("chkShowVoronoi").checked = false;
        bShowVoronoi=false;
    }
}

function selectImage(){
    let selected = document.getElementById("type").value;
    switch(selected){
        case "dog":
            gloria = loadImage("gloria_pickle.jpg", ImageLoaded);
            dropzoneEl.style.display="none";
            break;
        case "neo":
            gloria = loadImage("neo.jpg", ImageLoaded);
            dropzoneEl.style.display="none";
            break;
        case "random":
            points=[];
            generateRandomPoints(document.getElementById("numberOfPoints").value);
            // Calculate Delaunay triangulation and Voronoi diagram
            //delaunay = calculateDelaunay(points);
            //voronoi = delaunay.voronoi([0, 0, MAX_WIDTH, MAX_HEIGHT]);
            dropzoneEl.style.display="none";
            break;
        case "import":
            dropzoneEl.style.display="table-cell";
            break;
        default:
            gloria = loadImage("files/"+selected, ImageLoaded);
            break;
    }
    
}

function ImageLoaded(){
    RedrawImage();
}

function changeVacuum(){

}

function saveAnimation(){
    alert("Not ready yet!!!");
}