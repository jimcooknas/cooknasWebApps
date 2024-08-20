let canvas;
//let rcmMenu;
let cols = 40;
let rows = 40;

let particles = make2DArray(cols,rows);
let springs = [];

let springStrengthEl;
let springStrength = 0.8;

let w = 10;
let grabTolerance = 10;

let physics;
let dragger = null;
let draggerRadius = 20;
let showParticles = false;
let dragParticles = [];
let selectingKnot = false;
let selKnotX;
let selKnotY;

let bodyType = 0;//0=rectangle 1=string

function setup() {
    canvas = createCanvas(800, 600);
    var div = document.getElementsByClassName("canvasDiv")[0];
    canvas.elt.classList.add("deletable");
    canvas.parent(div);
    canvas.elt.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.pageX,
            top: e.pageY
        };
        setPosition(origin);
        return false;
    });

    springStrengthEl = document.getElementById("springStrength");
    selKnotX = document.getElementById("xpos");
    selKnotY = document.getElementById("ypos");
    physics = new VerletPhysics2D();
    let gravity = new Vec2D(0, 1);
    let gb = new GravityBehavior(gravity);
    physics.addBehavior(gb);
    createRectangleSoftBody();
}

function createRectangleSoftBody(){
    rows = 50;
    cols = 50;
    particles = make2DArray(cols,rows);
    springs = [];
    dragParticles = [];
    w=width/2/cols;
    showParticles = false;
    document.getElementById("chkShowKnots").checked = showParticles;
    let x = width/4;
    for (let i = 0; i < cols; i++) {
        let y = 10;
        for (let j = 0; j < rows; j++) {
            let p = new Particle(x, y);
            particles[i][j] = p;
            physics.addParticle(p);
            y = y + w;
        }
        x = x + w;
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let a = particles[i][j];
            if (i != cols-1) {
                let b1 = particles[i+1][j];
                let s1 = new Spring(a, b1);
                springs.push(s1);
                physics.addSpring(s1);
            }
            if (j != rows-1) {
                let b2 = particles[i][j+1];
                let s2 = new Spring(a, b2);
                springs.push(s2);
                physics.addSpring(s2);
            }
        }
    }
    dragParticles.push(particles[0][0]);
    dragParticles.push(particles[cols-1][0]);
    dragParticles.push(particles[0][rows-1]);
    dragParticles.push(particles[cols-1][rows-1]);
    for(var i=0;i<dragParticles.length;i++)
        dragParticles[i].lock();
}

function createStringSoftBody(){
    j = 0;
    rows = 1;
    cols = 50;
    particles = make2DArray(cols,rows);
    springs = [];
    dragParticles = [];
    showParticles = true;
    document.getElementById("chkShowKnots").checked = showParticles;
    let x = width/4;
    for (let i = 0; i < cols; i++) {
        let y = height/4;
        let p = new Particle(x, y);
        particles[i][j] = p;
        physics.addParticle(p);
        x = x + w;
    }
    for (let i = 0; i < cols; i++) {
        let a = particles[i][j];
        if (i != cols-1) {
            let b1 = particles[i+1][j];
            let s1 = new Spring(a, b1);
            springs.push(s1);
            physics.addSpring(s1);
        }
    }
    dragParticles.push(particles[0][0]);
    dragParticles.push(particles[cols-1][0]);
    for(var i=0;i<dragParticles.length;i++)
        dragParticles[i].lock();
}

function draw() {
    background(0);
    physics.update();
    if(showParticles){
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                particles[i][j].display();
            }
        }
    }

    for(var i=0;i<dragParticles.length;i++)
        dragParticles[i].display();

    for (let s of springs) {
        s.display();
    }
    if(dragger != null){
        dragger.display();
    }
}

function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function mousePressed(){
    if(selectingKnot){
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if(abs(particles[i][j].x-mouseX)<grabTolerance/2 && abs(particles[i][j].y-mouseY)<grabTolerance/2){
                    dragParticles.push(particles[i][j]);
                    dragParticles[dragParticles.length-1].lock();
                    selectingKnot = false;
                    disableElementChildren(document.getElementById("panelBox"), false);
                    document.getElementById("selectKnotDiv").style.backgroundColor = "transparent";
                    selKnotX.textContent = "";
                    selKnotY.textContent = "";
                    return;
                }
            }
        }
        selectingKnot = false;
        disableElementChildren(document.getElementById("panelBox"), false);
        document.getElementById("selectKnotDiv").style.backgroundColor = "transparent";
        selKnotX.textContent = "";
        selKnotY.textContent = "";
    }else{
        for(var i=0; i<dragParticles.length;i++){
            if (abs(mouseX - dragParticles[i].x) < grabTolerance && abs(mouseY - dragParticles[i].y) < grabTolerance) {
                dragParticles[i].grab = true;
                dragParticles[i].lock();
                dragger = new Dragger(mouseX, mouseY, draggerRadius);
                return;
            }
        }
    }
}

function mouseMoved(){
    if(selectingKnot){
        selKnotX.textContent = "X: " + mouseX.toFixed(0);
        selKnotY.textContent = "Y: " + mouseY.toFixed(0);
    }else{
        for(var i=0; i<dragParticles.length;i++){
            if (abs(mouseX - dragParticles[i].x) < grabTolerance && abs(mouseY - dragParticles[i].y) < grabTolerance) {
                dragger = new Dragger(dragParticles[i].x, dragParticles[i].y, draggerRadius);
                return;
            }
        }
        dragger = null;
    }
}

function mouseReleased(){
    for(var i=0; i<dragParticles.length;i++){
        dragParticles[i].grab = false;
    }
    dragger = null;
}

function mouseDragged() {
    for(var i=0; i<dragParticles.length;i++){
        if (dragParticles[i].grab){
            dragParticles[i].x = mouseX;
            dragParticles[i].y = mouseY;
            dragger.x = mouseX;
            dragger.y = mouseY;
        }
    }
}

function springStrengthChanged(){
    springStrength = 2.3 - springStrengthEl.value/10;
    document.getElementById("springStrengthValue").textContent = (springStrengthEl.value/10).toFixed(1);
    for (let s of springs) {
        s.strength = springStrength;
    }
}

function chkShowKnotsChanged(){
    showParticles = document.getElementById("chkShowKnots").checked;
}

function setRectangle(){
    if(bodyType!=0){
        bodyType = 0;
        createRectangleSoftBody();
    }
}

function setString(){
    if(bodyType != 1){
        bodyType = 1;
        createStringSoftBody();
    }
}

function selectKnot(){
    selectingKnot = true;
    document.getElementById("selectKnotDiv").style.backgroundColor = "darkorange";
    disableElementChildren(document.getElementById("panelBox"), true);
}

function selectAllKnots(){
    //dragParticles = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if(!dragParticles.includes(particles[i][j]))
                dragParticles.push(particles[i][j]);
        }
    }
    // for(var i=0;i<dragParticles.length;i++)
    //     dragParticles[i].lock();
}

function disableElementChildren(el, enable){
    // This will disable all the children of the div
    var nodes = el.getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = enable;
    }
}


const menu = document.querySelector(".menu");
const menuOption = document.getElementsByClassName("menu-option");//querySelector(".menu-option");
let menuVisible = false;

const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
    //console.log("L:"+left+" T:"+top);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
};

window.addEventListener("click", e => {
    if (menuVisible) toggleMenu("hide");
});

menuOption[0].addEventListener("click", e => {
    let x = parseInt(menu.style.left.replace('px','')) - (windowWidth-width)/2;
    let y = parseInt(menu.style.top.replace('px','')) - 0.03*windowHeight;
    //console.log(x + " - " + y);
    for(var i=0;i<dragParticles.length;i++){
        if(abs(dragParticles[i].x-x)<grabTolerance && abs(dragParticles[i].y-y)<grabTolerance){
            console.log("Found point "+i);
            dragParticles[i].unlock();
            dragParticles.splice(i, 1);
            return;
        }
    }
});
menuOption[1].addEventListener("click", e => {
    for(var i=0;i<dragParticles.length;i++){
        dragParticles[i].unlock();
    }
    dragParticles = [];
    if(bodyType==0){
        dragParticles.push(particles[0][0]);
        dragParticles.push(particles[cols-1][0]);
        dragParticles.push(particles[0][rows-1]);
        dragParticles.push(particles[cols-1][rows-1]);
    }else if(bodyType==1){
        dragParticles.push(particles[0][0]);
        dragParticles.push(particles[cols-1][0]);
    }
    for(var i=0;i<dragParticles.length;i++)
        dragParticles[i].lock();
});
menuOption[2].addEventListener("click", e => {
    for(var i=0;i<dragParticles.length;i++){
        dragParticles[i].unlock();
    }
    dragParticles = [];
});

