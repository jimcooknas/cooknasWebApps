// Flocking
// Daniel Shiffman
// https://thecodingtrain.com

// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

var flock = [];
var canvas;
var perceptionRadius=50;
var turn = 0.2;
//var avoidStrength=0.1;
var numOfBoids = 200;
var numOfPredetors = 2;

let alignValue, cohesionValue, separationValue, avoidValue, perceptionValue;
let alignSlider, cohesionSlider, separationSlider, avoidSlider, boidsNum, predatorsNum, perceptionSlider;
let showPerception;

function setup() {
  //canvas = document.getElementById("canvas");
  let lblAlign = createP('Align');
  lblAlign.position(4, -5,'fixed');
  alignValue = createP('1.0');
  alignValue.position(60,-5)
  alignSlider = createSlider(0, 2, 1, 0.1);
  alignSlider.position(2, 27, 'fixed');
  alignSlider.size(80);

  let lblCohesion = createP('Cohesion');
  lblCohesion.position(100,-5,'fixed');
  cohesionValue = createP('1.0');
  cohesionValue.position(170,-5,'fixed');
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(100,27,'fixed');
  cohesionSlider.size(90);

  let lblSeparation = createP('Separation');
  lblSeparation.position(214,-5,'fixed');
  separationValue = createP('1.0');
  separationValue.position(290,-5,'fixed');
  separationSlider = createSlider(0, 2, 1, 0.1);
  separationSlider.position(210,27,'fixed');
  separationSlider.size(100);

  let lblAvoid = createP('Avoid Predators');
  lblAvoid.position(330,-5,'fixed');
  avoidValue = createP('1.0');
  avoidValue.position(440,-5,'fixed');
  avoidSlider = createSlider(0, 2, 1, 0.1);
  avoidSlider.position(330,27,'fixed');
  avoidSlider.size(130);

  var lblBoidsNum = createP('Num of Boids');
  lblBoidsNum.position(480,-10,'fixed');
  boidsNum = createInput("200");
  boidsNum.position(480,22);
  boidsNum.size(85);

  var lblPredatorsNum = createP('Predators');
  lblPredatorsNum.position(590,-10,'fixed');
  predatorsNum = createInput("2");
  predatorsNum.position(590,22);
  predatorsNum.size(60);

  btnSet = createInput("Set","button");
  btnSet.position(670,20);
  btnSet.size(60);
  btnSet.mousePressed(function(){
    createFlock();
  });

  showPerception = createCheckbox("Show Perception");
  showPerception.position(740,21);

  var lblPerception = createP("Perception");
  lblPerception.position(880,-5);
  perceptionValue = createP("50");
  perceptionValue.position(965,-5);
  perceptionSlider = createSlider(10,80,50,1);
  perceptionSlider.position(880,27);
  perceptionSlider.size(100);

  canvas = createCanvas(windowWidth, windowHeight*0.9);
  canvas.position(0,48,'fixed');
  createFlock();
}

function createFlock(){
  flock=[];
  numOfBoids = parseInt(boidsNum.value());
  for (let i = 0; i < numOfBoids; i++) {
    flock.push(new Boid());
  }
  numOfPredators = parseInt(predatorsNum.value());
  for(let i=0;i<numOfPredators;i++)
    flock[i].isPredator = true;
}

function draw() {
  //canvas.width = document.body.width;
  //canvas,height=document.body.height;
  background(11);
  perceptionRadius = perceptionSlider.value();
  
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
  alignValue.html(nf(alignSlider.value(),1,1));
  cohesionValue.html(nf(cohesionSlider.value(),1,1));
  separationValue.html(nf(separationSlider.value(),1,1));
  avoidValue.html(nf(avoidSlider.value(),1,1));
  perceptionValue.html(perceptionSlider.value());
}