var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

var engine;
var world;
var particles = [];
var partUntouched = [];
var plinkos = [];
var bounds = [];
var cols = 22;
var rows = 9;
var slots = [];
var spacing;
var partCount=0;
var startingX;
let sliderRest;
let spanRest;
var ballRestitution = 1.0;
let sliderFric;
let spanFric;
var ballFric = 0;

//create panel with sliders and spans
function createPanel(){
  sliderRest = createSlider(0, 1 , ballRestitution, 0.01);
  sliderRest.position=(width, 20);
  sliderRest.style('width', '80px');
  sliderRest.parent("container");
  spanRest = createSpan('Restitution: '+ballRestitution.toFixed(2)+"    ");
  spanRest.parent("container");
  createSpan("     ").parent("container");
  sliderFric = createSlider(0, 1 , ballFric, 0.01);
  sliderFric.position=(width, 20);
  sliderFric.style('width', '80px');
  sliderFric.parent("container");
  spanFric = createSpan('Friction: '+ballFric.toFixed(2)+"    ");
  spanFric.parent("container");
}

function setup(){
  createCanvas(1200,680);
  engine = Engine.create();
  world = engine.world;
  createPanel();

  //collision event handler
  function collision(event){
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var labelA = pairs[i].bodyA.label;
      var labelB = pairs[i].bodyB.label;
      if (labelA=='particle' && labelB=='boundary') {
        var idx = partUntouched.indexOf(pairs[i].bodyA.id);
        if(idx > -1){
          getSlotByParticle(pairs[i].bodyA);
          partUntouched.splice(idx,1);
        }
      }
      if (labelA=='boundary' && labelB=='particle') {
        var idx = partUntouched.indexOf(pairs[i].bodyB.id);
        if(idx > -1){
          getSlotByParticle(pairs[i].bodyB);
          partUntouched.splice(idx,1);
        }
      }
    }
  }

  Events.on(engine, 'collisionStart', collision);
  startingX = width/2;
  //add a droping ball
  newParticle();
  //create plinkos
  spacing = width / cols;
  for(var j = 0; j < rows; j++){
    for(var i = 0; i < cols + 1; i++){
      var x = i * spacing;
      if (j % 2 == 0) {
        x += spacing / 2;
      }
      var y = spacing + j * spacing;
      var p = new Plinko(x, y, 16);
      plinkos.push(p);
    }
  }
  //create botom boundary
  var b = new Boundary(width / 2, height + 20, width, 100);
  bounds.push(b);
  //... and all the lines of boundaries
  textSize(12);
  textAlign(CENTER, CENTER);
  for (var i = 0; i < cols + 2; i++) {
    var x = i * spacing;
    var h = 150;
    var w = 4;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    if(i>0)slots.push(0);
    bounds.push(b);
    text('0', (i+1)*spacing-spacing/2, height-10)
  }
}

/*creation of New Particle*/
function newParticle(){
  var p = new Particle(startingX, 50, 10);
  particles.push(p);
  partUntouched.push(p.body.id);
  partCount++;
}

/*if mouse pressed above the boundaries*/
function mousePressed(){
  if(mouseY<spacing)
    startingX = mouseX;
}

function draw(){
  ballRestitution = sliderRest.value();
  spanRest.html('Restitution: '+ballRestitution.toFixed(2)+"    ");
  ballFric = sliderFric.value();
  spanFric.html("Friction: "+ballFric.toFixed(2));
  background(0, 0, 0);
  if(frameCount % 60 ==0){
    newParticle();
  }
  Engine.update(engine, 1000/30);
  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    if (particles[i].isOffScreen()) {
      World.remove(world, particles[i].body);
      particles.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < plinkos.length; i++) {
    plinkos[i].show();
  }
  for (var i = 0; i < bounds.length; i++) {
    bounds[i].show();
  }
  fill(255, 0, 0);
  for(var i = 0; i < slots.length; i++){
    text(''+slots[i], (i+1)*spacing-spacing/2, height-10)
  }
  noFill();
  stroke(255,0,0);
  ellipse(startingX, spacing/2, 20, 20);
}

/* find in which slot the ball comes in and increase its counter */
function getSlotByParticle(b){
  var idx = int(b.position.x / spacing);
  slots[idx] += 1;
}