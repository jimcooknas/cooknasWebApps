//Coding Train: https://editor.p5js.org/codingtrain/sketches/zrq8KHXnO
var requestId;
var width;
var height;
var canvas = document.getElementById("canvas");
var ctx;
var initColor;
var initRadius;
var useColorEl;
var useColor


// All circles in the gasket
let allCircles = [];
// Queue for circles to process for next generation
let queue = [];
// Tolerance for calculating tangency and overlap
let epsilon = 0.1;

document.getElementById("refresh").addEventListener("click", function(e){
    setup();
    requestId = requestAnimationFrame(show);
});

window.addEventListener("load", function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    canvas.addEventListener("click", function(e){
        requestId = requestAnimationFrame(show);
    });
    
    /*instaniate the sliding panel*/
    //createStyles("left");
    var panel = document.getElementsByClassName("hamburger-menu")[0];
    addPanelElement("div", "txtDiv1", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl1", "txtDiv1", "Step By Mouse Click", "menu__label");
    addPanelElement("input checkbox", "chk", "txtDiv1", "", "");
    this.document.getElementById("lbl1").style.maxWidth="100%";
    
    addPanelElement("div", "txtDiv2", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl1a", "txtDiv2", "Use Colors", "menu__label");
    useColorEl = addPanelElement("input checkbox", "chkColor", "txtDiv2", "", "");
    this.document.getElementById("lbl1a").style.maxWidth="100%";
    
    addPanelElement("div", "txtDiv3", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl2", "txtDiv3", "Set Gasket Color", "menu__label");
    addPanelElement("input color", "color", "txtDiv3", "", "");
    this.document.getElementById("lbl2").style.maxWidth="100%";
    this.document.getElementById("lbl2").style.padding = "4px";
    this.document.getElementById("color").value="#ff0000";
    if(useColor){
        document.getElementById("txtDiv3").style.display = "block";
    }else{
        document.getElementById("txtDiv3").style.display = "none";
    }
    useColorEl.addEventListener("change", function(e){
        useColor = !useColor;
        if(useColor){
            document.getElementById("txtDiv3").style.display = "block";
        }else{
            document.getElementById("txtDiv3").style.display = "none";
        }
    });
    noLoop();
    setup();
    requestId = requestAnimationFrame(show);
});

function setup() {
    //createCanvas(660, 660);
    if(document.getElementById("color")!=null)
        initColor = document.getElementById("color").value;
    initRadius = 330;
    // Initialize first circle centered on canvas
    let c1 = new Circle(-1 / (width / 2), width / 2, height / 2);
    let r2 = 100 + Math.random() * c1.radius / 2;
    let v = p5.Vector.fromAngle(2 * Math.PI * Math.random());
    v.setMag(c1.radius - r2);
    
    // Second circle positioned randomly within the first
    let c2 = new Circle(1 / r2, width / 2 + v.x, height / 2 + v.y);
    let r3 = v.mag();
    v.rotate(Math.PI);
    v.setMag(c1.radius - r3);
    
    // Third circle also positioned relative to the first
    let c3 = new Circle(1 / r3, width / 2 + v.x, height / 2 + v.y);
    allCircles = [c1, c2, c3];
    // Initial triplet for generating next generation of circles
    queue = [[c1, c2, c3]];
}

// Check if the potential new circle is valid
function validate(c4, c1, c2, c3) {
    // Discards too small circles to avoid infinite recursion
    if (c4.radius < 2) return false;

    for (let other of allCircles) {
        let d = c4.dist(other);
        let radiusDiff = Math.abs(c4.radius - other.radius);
        // Ensures new circle doesn't overlap or is too close to existing circles
        if (d < epsilon && radiusDiff < epsilon) {
            return false;
        }
    }

    // Check if all 4 circles are mutually tangential
    if (!isTangent(c4, c1)) return false;
    if (!isTangent(c4, c2)) return false;
    if (!isTangent(c4, c3)) return false;

    return true;
}

// Determine if two circles are tangent to each other
function isTangent(c1, c2) {
    let d = c1.dist(c2);
    let r1 = c1.radius;
    let r2 = c2.radius;
    // Tangency check based on distances and radii
    let a = Math.abs(d - (r1 + r2)) < epsilon;
    let b = Math.abs(d - Math.abs(r2 - r1)) < epsilon;
    return a || b;
}

function nextGeneration() {
    let nextQueue = [];
    for (let triplet of queue) {
        let [c1, c2, c3] = triplet;
        // Calculate curvature for the next circle
        let k4 = descartes(c1, c2, c3);
        // Generate new circles based on Descartes' theorem
        let newCircles = complexDescartes(c1, c2, c3, k4);

        for (let newCircle of newCircles) {
            if (validate(newCircle, c1, c2, c3)) {
                allCircles.push(newCircle);
                // New triplets formed with the new circle for the next generation
                let t1 = [c1, c2, newCircle];
                let t2 = [c1, c3, newCircle];
                let t3 = [c2, c3, newCircle];
                nextQueue = nextQueue.concat([t1, t2, t3]);
            }
        }
    }
    queue = nextQueue;
}

function show() {
    ctx.clearRect(0, 0, width, height);
    // Current total circles
    let len1 = allCircles.length;
    // Generate next generation of circles
    nextGeneration();
    // New total circles
    let len2 = allCircles.length;
    // Stop drawing when no new circles are added
    if (len1 == len2) {
        console.log('done');
        cancelAnimationFrame(requestId);
        if(document.getElementById("chk").checked)
            alert("Appolonian Gasket completed whithin the limits of epsilon (="+epsilon+")");
    }
    // Display all circles
    for (let c of allCircles) {
        c.show(ctx);
    }
    if (len1 != len2)
        if(!document.getElementById("chk").checked) requestId = requestAnimationFrame(show);
}

// Complex calculations based on Descartes' theorem for circle generation
// https://en.wikipedia.org/wiki/Descartes%27_theorem
function complexDescartes(c1, c2, c3, k4) {
    // Curvature and center calculations for new circles
    let k1 = c1.bend;
    let k2 = c2.bend;
    let k3 = c3.bend;
    let z1 = c1.center;
    let z2 = c2.center;
    let z3 = c3.center;

    let zk1 = z1.scale(k1);
    let zk2 = z2.scale(k2);
    let zk3 = z3.scale(k3);
    let sum = zk1.add(zk2).add(zk3);

    let root = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3));
    root = root.sqrt().scale(2);
    let center1 = sum.add(root).scale(1 / k4[0]);
    let center2 = sum.sub(root).scale(1 / k4[0]);
    let center3 = sum.add(root).scale(1 / k4[1]);
    let center4 = sum.sub(root).scale(1 / k4[1]);

    return [
        new Circle(k4[0], center1.a, center1.b),
        new Circle(k4[0], center2.a, center2.b),
        new Circle(k4[1], center3.a, center3.b),
        new Circle(k4[1], center4.a, center4.b),
    ];
}

// Calculate curvatures (k-values) for new circles using Descartes' theorem
function descartes(c1, c2, c3) {
    let k1 = c1.bend;
    let k2 = c2.bend;
    let k3 = c3.bend;
    // Sum and product of curvatures for Descartes' theorem
    let sum = k1 + k2 + k3;
    let product = Math.abs(k1 * k2 + k2 * k3 + k1 * k3);
    let root = 2 * Math.sqrt(product);
    return [sum + root, sum - root];
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

