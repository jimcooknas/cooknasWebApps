//planet names
const planetNames = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Neptune",
    "Uranus",
    "Moon"
];

//planet centers
const ORBIT_CENTER = {
    Mercury: "Sun",
    Venus: "Sun",
    Earth: "Sun",
    Mars: "Sun",
    Jupiter: "Sun",
    Saturn: "Sun",
    Neptune: "Sun",
    Uranus: "Sun",
    Moon: "Earth"
}
// planet colors in RGB
const COLOR_MAP = {
    Mercury: [140, 140, 140],
    Venus: [207, 181, 59],
    Earth: [59, 144, 255],
    Mars: [224, 100, 58],
    Jupiter: [219, 193, 151],
    Saturn: [235, 226, 211],
    Uranus: [190, 222, 235],
    Neptune: [84, 224, 255],
    Moon: [224,224,224]
  }
  // planet distance to the Sun (adjusted)
  const DISTANCE = {
    Mercury: 4 * 3 * 5,
    Venus: 7 * 2 * 5,
    Earth: 10 * 2 * 5,
    Mars: 15 * 2 * 5,
    Jupiter: 52 * 5,
    Saturn: 95 * 3,
    Neptune: 301 * 3,
    Uranus: 198 * 3,
    Moon: 15
  }
  // planet orbiting speed
  const SPEED = {
    Mercury: 6 * 88 / 3650 * 30,
    Venus: 3 * 225 / 3650 * 30,
    Earth: 10 / 100 * 30,
    Mars: 15 * 2 * 30,
    Jupiter: 10 / 1186 * 30,
    Saturn: 10 / 2945 * 30,
    Neptune: 10 / 16481 * 30,
    Uranus: 10 / 2945 * 30,
    Moon: 20
  }
  // planet size in relation to Earth (adjusted)
  const SIZE = {
    Mercury: 2 / 5 * 5,
    Venus: 1 * 5,
    Earth: 1 * 5,
    Mars: 0.5 * 5,
    Jupiter: 11 / 4 * 5,
    Saturn: 9 / 4 * 5,
    Neptune: 4 / 3 * 5,
    Uranus: 4 / 3 * 5,
    Moon: 2
  }
  //does planet has rings (like Saturn)?
  const HAS_RINGS = {
    Mercury: false,
    Venus: false,
    Earth: false,
    Mars: false,
    Jupiter: false,
    Saturn: true,
    Neptune: false,
    Uranus: false,
    Moon: false
  }

//Orbiter objects
let planets = [];
let sun = new Orbiter(null, "Sun", 30, 0);
//DOM objects
let sliderRate;
let chkTail;
let chkName;
let spanScaleLabel;
let spanScale;
let btnStart;
//variables for DOM objects
let frRate = 30;
var drawTail = true;
var drawName = true;
var drawScale = 1.0;
var isRunning = true;


function setup() {
    createCanvas(windowWidth - 3, windowHeight - 3);
    frameRate(frRate);

    sun.x = windowWidth / 2;
    sun.y = windowHeight / 2;
    sun.color = color(255, 200, 0);

    // Instantiate planets
    for (i = 0; i < 9; i++) {
        var center = getCenterByName(planetNames[i]);
        //if(planetNames[i]=="Moon")
            planets[i] = new Orbiter(center, planetNames[i], SIZE[planetNames[i]],DISTANCE[planetNames[i]], HAS_RINGS[planetNames[i]]);
        //else
        //    planets[i] = new Orbiter(sun, planetNames[i], SIZE[planetNames[i]],DISTANCE[planetNames[i]], HAS_RINGS[planetNames[i]]);
        planets[i].color = COLOR_MAP[planetNames[i]];
    }
    createPanel();
}

function createPanel(){
    sliderRate = createSlider(20, 144, 30, 1);
    sliderRate.position(10,10);
    sliderRate.style('width', '80px');
    chkTail = createCheckbox("Draw tails", true);
    chkTail.position(100,10);
    chkTail.style('color','white');
    chkTail.changed(myCheckedEvent);
    chkName = createCheckbox("Draw names", true);
    chkName.position(200,10);
    chkName.style('color','white');
    chkName.changed(myCheckedEvent);
    spanScaleLabel = createSpan("Scale:");
    spanScaleLabel.position(320,10);
    spanScaleLabel.style('color','white');
    spanScale = createSpan("1.0");
    spanScale.position(360,10);
    spanScale.style('color','yellow');
    spanScale.style('font-weight', '900');
    btnStart = createButton("Stop");
    btnStart.position(400,10);
    btnStart.size(60,24);
    btnStart.mousePressed(startMousePressed);
}

function getCenterByName(name){
    for(p of planets){
        if(ORBIT_CENTER[name] == p.planetName)
            return p;
    }
    return sun;
}

function startMousePressed(){
    if(isRunning){
        isRunning=false;
        btnStart.html("Start");
        //noLoop();
    }else{
        isRunning=true;
        btnStart.html("Stop");
        //loop();
    }
}

function myCheckedEvent(){
    drawTail = chkTail.checked();
    drawName = chkName.checked();
}

function mouseWheel(event) {
    //print(event.delta);
    drawScale -= event.delta/1000;
    sun.x = windowWidth / 2 / drawScale;
    sun.y = windowHeight / 2 / drawScale;
    for(p of planets){
        p.history = [];
        p.counter = 0;
        p.pathLen = 0;
    }
    spanScale.html(drawScale.toFixed(1).toString());
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth - 3, windowHeight - 3);
    sun.x = windowWidth / 2 / drawScale;
    sun.y = windowHeight / 2 / drawScale;
    for(p of planets){
        p.history = [];
        p.counter = 0;
        p.pathLen = 0;
    }
    //console.log("window resized");
    //resize planets history
}

function draw() {
    if(!isRunning)return;
    frRate = sliderRate.value();
    frameRate(frRate);
    background(0, 10, 40);
    push();
    scale(drawScale);
    sun.display();
    //var msg="";
    for (planet of planets) {
        planet.orbit();
        planet.display();
        //msg += planet.history.length + " ";
    }
    pop();
    //console.log(msg);
}