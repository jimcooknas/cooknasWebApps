import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { TrailRenderer } from './TrailRenderer.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';


const G = 0.55;//6.67408 * Math.pow(10, -11);
//html elements
var panel = document.getElementById("panel");
var panelHandle = document.getElementById("panelHandle");
var panelHidden = false;
var txtNumOfBalls = document.getElementById("numOfBalls");
var selectedBody = 0;
var selectedScenario = 0;
var totalBodies = 3;
var selectedObjectSelect = document.getElementById("selectedObjectSelect");
var predefinedSelect = document.getElementById("predefinedSelect");
var btnStartStop = document.getElementById("btnStartStop");
var massSlider = document.getElementById("massSlider");
var posXSlider = document.getElementById("posXSlider");
var posYSlider = document.getElementById("posYSlider");
var posZSlider = document.getElementById("posZSlider");
var posXLabel = document.getElementById("posXLabel");
var posYLabel = document.getElementById("posYLabel");
var posZLabel = document.getElementById("posZLabel");
var velXSlider = document.getElementById("velXSlider");
var velYSlider = document.getElementById("velYSlider");
var velZSlider = document.getElementById("velZSlider");
var velXLabel = document.getElementById("velXLabel");
var velYLabel = document.getElementById("velYLabel");
var velZLabel = document.getElementById("velZLabel");
var timeValue = document.getElementById("timeValue");
//var checkVelOrPos = document.getElementsByName("velposGroup");
var radPos = document.getElementById("position");
var radVel = document.getElementById("velocity");
var timeScaleSlider = document.getElementById("timeScaleSlider");
var timeScaleLabel = document.getElementById("timeScaleLabel");
var checkAsStar = document.getElementById("checkAsStar");
var bCheckCollisions = true;
var objects = [document.getElementById("objA"), document.getElementById("objB"), document.getElementById("objC")];
var showVelocities = true;
//balls variables
var massDivider = 10;
var posDivider= 10000;
var velDivider = 10000;
var radius = .25; // size of balls, default value 0.25
var ballRadius = []; // a list of all ball sizes
var range = 5;  // size of enclosing box
var balls = []; //the ball objects on scene
var lights = [];
var velos = [];
var trails = [];
//var trailLines = [];
var trailPoints = [];
var trailMaterial = [];
var maxPoints = 1000;
var loopCounter=0;
var loopMax=20;
var group;
var ballGroup;
var rotation = 0.005;
var timeScale=0.01;
var timeScaleSteps = 100;//integer: a divisor of the timeScale
var clock;


//scene, renderer, camera and lights
var scene;
var renderer;
var camera;
var controls;
var light;
var ambient;
var axesHelper;
var isRunning = false;
var renderId;
var isParticlesShown = true;
var log = false;
var renderScene;
var bloomPass;
var bloomComposer;
var asStar=true;

//scenarios
var scenario = [
                {name:"Scenario1", mass:[1.4,0.8,0.3], pos:[{x:-1,y:0,z:0},{x:3,y:0,z:0},{x:0,y:1,z:1}], vel:[{x:0,y:-0.3,z:0},{x:0,x:0.2,z:0},{x:0,y:0,z:1}]},
                {name:"Scenario2", mass:[1.6,1.6,0.1], pos:[{x:-2,y:0,z:0},{x:2,y:0,z:0},{x:0,y:1,z:-1}], vel:[{x:0,y:0.5,z:0},{x:0,x:0.5,z:0},{x:0,y:0,z:0}]},
               ]
//initial conditions
var initialMass = [];
var density = 20;
var initMass = [1.4,0.8,0.3];
var initPos = [{x: 0.97000436, y: -0.24308753, z:0},{x: -0.97000436, y: 0.24308753, z:0},{x: 0.0, y: 0.0, z:0}];
var initVel = [{x:0.43240737/2, y: -0.46473146/2, z:-0.50},{x: 0.43240737/2, y: 0.46473146/2, z:0.5},{x: -0.43240737, y: -0.36473146, z:-0.2}];
var initColor = [0xff0000, 0x00ff00, 0xffff00];

function generateScene(){
    //create scene object
    scene = new THREE.Scene();
    //create the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: rendererCanvas } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setClearColor( 0x000000 );
    document.body.appendChild( renderer.domElement );
    //create the camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.up.set( 0, 0, 1 );
    camera.position.set(10,5,10); //3.5*range, 0.0, 0.0 );//2, 1.5, 2.5
    camera.layers.enable(1);
    //create the controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.zoomSpeed = 2.0;
    controls.panSpeed = 0.4;
    controls.enableDamping = true;
    controls.screenSpacePanning = true;
    controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
    }
    window.removeEventListener( 'resize', winResizeListener);
    window.addEventListener( 'resize', winResizeListener);
    //bloom renderer
    if(asStar){
        renderScene = new RenderPass(scene, camera);
        bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 2; //intensity of glow
        bloomPass.radius = 0;
        bloomComposer = new EffectComposer(renderer);
        bloomComposer.setSize(window.innerWidth, window.innerHeight);
        bloomComposer.renderToScreen = true;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);
    }
    //create lights
    light = new THREE.DirectionalLight( 0xffffff, .8 );
    light.position.set( -range, range, 0 );
    camera.add( light );
    scene.add( camera );
    ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );
    //create 3D axes
    axesHelper = new THREE.AxesHelper( 1 );
    axesHelper.layers.set(0);
    scene.add( axesHelper );
    //create Clock (might be needed)
    clock = new THREE.Clock();
}

function generateBalls(){
    totalBodies = parseInt(txtNumOfBalls.value);
    balls=[];
    trailPoints =[];
    group = undefined;
    ballGroup = new THREE.Group();
    for ( var i = 0 ; i < totalBodies ; i++ ) {
        //the labels with position and velocity values at the bottom of panel
        objects[i].style.backgroundColor="'"+initColor[i]+"'";
        //create bodies (balls)
        radius = Math.pow(3*initMass[i]/(4*Math.PI*density),1/3);
        initialMass[i]=radius;
        ballRadius.push(radius);
        var geometry = new THREE.SphereGeometry( radius, 20, 20 );
        var material = new THREE.MeshBasicMaterial({color:new THREE.Color("#FDB813"),transparent:true, opacity:0.8});//initColor[i]
        var ball = new THREE.Mesh( geometry, material );
        ball.position.set(initPos[i].x,initPos[i].y,initPos[i].z);
        ball.v = new THREE.Vector3(initVel[i].x,initVel[i].y,initVel[i].z);
        if(asStar)ball.layers.set(1);//set to layer 1 to take the Effects to looklike a star
        var lightObj = new THREE.PointLight( 0xffff00, 10, 0, 2);
        lightObj.position.set(initPos[i].x,initPos[i].y,initPos[i].z);
        //velocity vector
        var line = [ball.position, ball.position.clone().add(ball.v)];
        var geometryVel = new THREE.BufferGeometry().setFromPoints(line);
        var materialVel = new THREE.LineBasicMaterial({color:initColor[i], transparent:true, opacity: 0.7});
        var velo = new THREE.Line(geometryVel,materialVel);
        if(asStar)velo.layers.set(0);
        //trails
        var trail = createTrailRenderer(ball, scene, radius, initColor[i]);
        if(asStar)trail.layers.set(0);
        trail.activate();
        
        //add them up
        velos.push(velo);
        balls.push( ball );
        lights.push(lightObj);
        trails.push(trail);
        ballGroup.add(ball);
        ballGroup.add(lightObj);
        ballGroup.add(velo);
        ballGroup.add(trail);
    }
    scene.add(ballGroup);
    for(var i=0;i<balls.length;i++){
        if(showVelocities){
            objects[i].innerText = "x:"+balls[i].v.x.toExponential(1)+" y:"+balls[i].v.y.toExponential(1)+" z:"+balls[i].v.z.toExponential(1)
        }else{
            objects[i].innerText = "x:"+balls[i].position.x.toExponential(1)+" y:"+balls[i].position.y.toExponential(1)+" z:"+balls[i].position.z.toExponential(1)
        }
    }
    // galaxy geometry
    const starGeometry = new THREE.SphereGeometry(1000, 64, 64);
    // galaxy material
    const starMaterial = createGalaxyMaterial("textures/galaxy1.png");
    // galaxy mesh
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.layers.set(1);
    scene.add(starMesh);
}

function createGalaxyMaterial(textureUrl) {

    var material = new THREE.MeshBasicMaterial(); // create a material
    var loader = new THREE.TextureLoader().load(
        // resource URL
        textureUrl,
        // Function when resource is loaded
        function ( texture ) {
            // do something with the texture
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.offset.x = 90/(2*Math.PI);
            material.map = texture; // set the material's map when when the texture is loaded
        },
        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
        }
    );
    return material; // return the material
}

function createTrailRenderer(body, sc, rad, col){
    // specify points to create planar trail-head geometry
    var circlePoints = [];
    const twoPI = Math.PI * 2;
    let index = 0;
    const scale = rad/4;
    const inc = twoPI / 32.0;
    for (let i = 0; i <= twoPI + inc; i+= inc) {
        const vector = new THREE.Vector3();
        vector.set(Math.cos(i) * scale, 0, Math.sin(i) * scale);
        circlePoints[ index ] = vector;
        index++;
    }
    const trailHeadGeometry = circlePoints;
    // create the trail renderer object
    const trail = new TrailRenderer( sc, false );
    // set how often a new trail node will be added and existing nodes will be updated
    trail.setAdvanceFrequency(30);
    // create material for the trail renderer
    const trailMaterial = TrailRenderer.createBaseMaterial();
    var color = getRGB(col);	
    trailMaterial.uniforms.headColor.value.set(color[0]/255, color[1]/255, color[2]/255, 0.8);
    trailMaterial.uniforms.tailColor.value.set(color[0]/255, color[1]/255, color[2]/255, 0.2);
    // specify length of trail
    const trailLength = 1000;
    // initialize the trail
    trail.initialize( trailMaterial, trailLength, false, 0, trailHeadGeometry, body );
    
    return trail;
}

function render() {
    if(isRunning){
        renderId = requestAnimationFrame(render);
        updateBodies();
        //var timeDelta = clock.getDelta()*timeScale;
        for ( var i = 0 ; i < balls.length ; i++ ) {
            balls[i].position.add( balls[i].v.clone().multiplyScalar(timeScale));
            lights[i].position.set(balls[i].position.x,balls[i].position.y,balls[i].position.z);
            loopCounter++;
            if(showVelocities){
                objects[i].innerText = "x:"+balls[i].v.x.toExponential(1)+" y:"+balls[i].v.y.toExponential(1)+" z:"+balls[i].v.z.toExponential(1)
            }else{
                objects[i].innerText = "x:"+balls[i].position.x.toExponential(1)+" y:"+balls[i].position.y.toExponential(1)+" z:"+balls[i].position.z.toExponential(1)
            }
            velos[i].geometry.setFromPoints([balls[i].position, balls[i].position.clone().add(balls[i].v)]);
            trails[i].update();
            timeValue.textContent = convertStringTime(clock.getElapsedTime());
        }
        if(asStar){
            renderer.autoClear = false;
            renderer.clear();
            camera.layers.set(1);
            bloomComposer.render();
            renderer.clearDepth();
            camera.layers.set(0);
            renderer.render(scene, camera);
            controls.update();
        }else{
            renderer.render( scene, camera );
            controls.update();
        }				
    }else{
        renderId = requestAnimationFrame(render);
        if(asStar){
            renderer.autoClear = false;
            renderer.clear();
            camera.layers.set(1);
            bloomComposer.render();
            renderer.clearDepth();
            camera.layers.set(0);
            renderer.render(scene, camera);
            controls.update();
        }else{
            renderer.render( scene, camera );
            controls.update();
        }
    }
}

function updateBodies(){
    //var timeDelta=clock.getDelta()*timeScale;
    for(var t=0;t<timeScaleSteps;t++){
        for(var i=0;i<balls.length-1;i++){
            var ball = balls[i];
            for(var j=i+1;j<balls.length;j++){
                var other=balls[j];
                var dir = new THREE.Vector3();//ball.position.sub(other.position).normalize();
                dir.subVectors(other.position, ball.position).normalize();
                var dist = ball.position.distanceTo(other.position);
                var force = G * initMass[i] * initMass[j] / (dist * dist); 
                var acc1 = dir.clone().multiplyScalar(force/initMass[i]);
                ball.v.add(acc1.multiplyScalar(timeScale/timeScaleSteps));
                var acc2 = dir.clone().multiplyScalar(-force/initMass[j]);
                other.v.add(acc2.multiplyScalar(timeScale/timeScaleSteps));
            }
        }
    }
}

function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);
    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

function convertStringTime(val){
    //val is a float of seconds
    var hours = Math.floor(val/3600);
    var minutes = Math.floor((val-hours*3600)/60);
    var seconds = Math.floor(val-hours*3600-minutes*60);
    return hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+":"+minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+":"+seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
}

function getLengthSq(v){
    return v.x*v.x+v.y*v.y+v.z*v.z;
}

function winResizeListener(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if(asStar)bloomComposer.setSize(window.innerWidth, window.innerHeight);
}

function showHidePanel(){
    if(panelHidden){
        panel.style.transform = "translateX(0)";
        document.getElementById("eyeSymbol").classList.remove("fa-eye");
        document.getElementById("eyeSymbol").classList.add("fa-eye-slash");
    }else{
        panel.style.transform = "translateX(-100%)";
        document.getElementById("eyeSymbol").classList.remove("fa-eye-slash");
        document.getElementById("eyeSymbol").classList.add("fa-eye");
    }
    panelHidden = !panelHidden;
}

function resetBalls(){
    isRunning = false;
    cancelAnimationFrame(renderId);
    
    for(var i = balls.length-1; i >= 0; i--){
        ballGroup.remove(balls[i]);
        ballGroup.remove(lights[i]);
        ballGroup.remove(velos[i]);
        ballGroup.remove(trails[i]);
    }
    scene.remove(ballGroup);
    if(group!=undefined)scene.remove(group);
    balls = [];
    lights = [];
    velos = [];
    trails = [];
    totalBodies = parseInt(txtNumOfBalls.value);
    generateScene();
    generateBalls();
    isRunning=false;
    btnStartStop.value="Start";
    render();
    //do not render() here. The render() is already running continously by the initial call
}

function objectSelected(){
    selectedBody = parseInt(selectedObjectSelect.value);
    //selectedObjectSelect.options[selectedBody].selected=true;
    console.log(selectedObjectSelect.value);
    setContents(selectedBody);
    resetBalls();
}

function addOption(i){
    var newOption = document.createElement("option");
    newOption.value = i.toString();
    newOption.text = "Object "+(i+1);
    try{
        selectedObjectSelect.add(newOption);// this will fail in DOM browsers but is needed for IE
    }catch(e){
        selectedObjectSelect.appendChild(newOption);
    }
}

function addPredefined(i){
    var newOption = document.createElement("option");
    newOption.value = i.toString();
    newOption.text = scenario[i].name;
    try{
        predefinedSelect.add(newOption);// this will fail in DOM browsers but is needed for IE
    }catch(e){
        predefinedSelect.appendChild(newOption);
    }
}

// function removeAllOptions(){
//     while (selectedObjectSelect.options.length > 0) { 
//         selectedObjectSelect.remove(0);
//     } 
// }

function createOptions(){
    selectedObjectSelect.options.length = 0;
    for(var i=0;i<totalBodies;i++) addOption(i);
    setContents(0);
}

function createPredefined(){
    predefinedSelect.options.length = 0;
    for(var i=0;i<scenario.length;i++) addPredefined(i);
    //setContents(0);
}

function setContents(sel){
    massSlider.value = initMass[sel]*massDivider;
    massLabel.textContent = initMass[sel].toFixed(1);

    posXSlider.value=initPos[sel].x*posDivider;
    posXLabel.textContent=initPos[sel].x.toFixed(4);

    posYSlider.value=initPos[sel].y*posDivider;
    posYLabel.textContent=initPos[sel].y.toFixed(4);

    posZSlider.value=initPos[sel].z*posDivider;
    posZLabel.textContent=initPos[sel].z.toFixed(4);

    velXSlider.value=initVel[sel].x*velDivider;
    velXLabel.textContent=initVel[sel].x.toFixed(4);

    velYSlider.value=initVel[sel].y*velDivider;
    velYLabel.textContent=initVel[sel].y.toFixed(4);

    velZSlider.value=initVel[sel].z*velDivider;
    velZLabel.textContent=initVel[sel].z.toFixed(4);
}

function setMassSlider(){
    initMass[selectedBody] = parseInt(massSlider.value)/massDivider;
    massLabel.textContent = initMass[selectedBody].toFixed(1);
    var sc = Math.pow(3*initMass[selectedBody]/(4*Math.PI*density),1/3)/initialMass[selectedBody];
    balls[selectedBody].scale.set(sc,sc,sc);
    resetBalls();
}

function pXSlider(){
    initPos[selectedBody].x = parseInt(posXSlider.value)/posDivider;
    posXLabel.textContent = initPos[selectedBody].x.toFixed(4);
    resetBalls();
}

function pYSlider(){
    initPos[selectedBody].y = parseInt(posYSlider.value)/posDivider;
    posYLabel.textContent = initPos[selectedBody].y.toFixed(4);
    resetBalls();
}

function pZSlider(){
    initPos[selectedBody].z = parseInt(posZSlider.value)/posDivider;
    posZLabel.textContent = initPos[selectedBody].z.toFixed(4);
    resetBalls();
}

function vXSlider(){
    initVel[selectedBody].x = parseInt(velXSlider.value)/velDivider;
    velXLabel.textContent = initVel[selectedBody].x.toFixed(4);
    resetBalls();
}

function vYSlider(){
    initVel[selectedBody].y = parseInt(velYSlider.value)/velDivider;
    velYLabel.textContent = initVel[selectedBody].y.toFixed(4);
    resetBalls();
}

function vZSlider(){
    initVel[selectedBody].z = parseInt(velZSlider.value)/velDivider;
    velZLabel.textContent = initVel[selectedBody].z.toFixed(4);
    resetBalls();
}

function startStop(){
    isRunning = !isRunning;
    if(isRunning){
        btnStartStop.value="Stop";
        render();
        //do not render here. render is already running
    }else{
        btnStartStop.value="Start";
    }
}

function getRGB(color){
    //color in the form of 0xffffff or #ffffff
    if(color.length == 8){
        var r = parseInt(color.substr(2,2));
        var g = parseInt(color.substr(4,2));
        var b = parseInt(color.substr(6,2));    
        return [r, g, b];
    }else if(color.length == 7) {
        var r = parseInt(color.substr(1,2));
        var g = parseInt(color.substr(3,2));
        var b = parseInt(color.substr(5,2));  
        return [r, g, b];
    }else if(typeof color === 'number'){
        var r = color >>> 16 & 0xff;
        var g = color >>> 8 & 0xff; 
        var b = color & 0xff;
        return [r, g, b];
    }else
      console.log('Enter correct value');
}

panelHandle.addEventListener('click', function(ev){
    showHidePanel();
});

btnStartStop.addEventListener('click', function(ev){
    startStop();
});

document.getElementById("btnSet").addEventListener('click', function(ev){
    createOptions();
    resetBalls();
});

selectedObjectSelect.addEventListener('change', function(ev){
    objectSelected();
});

massSlider.addEventListener('input', function(ev){
    setMassSlider();
});

posXSlider.addEventListener('input', function(ev){
    pXSlider();
});
posXSlider.addEventListener('dblclick', function(ev){
    initPos[selectedBody].x=0;
    posXSlider.value=initPos[selectedBody].x.toString();
    posXLabel.textContent = initPos[selectedBody].x.toFixed(4);
});

posYSlider.addEventListener('input', function(ev){
    pYSlider();
});
posYSlider.addEventListener('dblclick', function(ev){
    initPos[selectedBody].y=0;
    posYSlider.value=initPos[selectedBody].y.toString();
    posYLabel.textContent = initPos[selectedBody].y.toFixed(4);
});

posZSlider.addEventListener('input', function(ev){
    pZSlider();
});
posZSlider.addEventListener('dblclick', function(ev){
    initPos[selectedBody].z=0;
    posZSlider.value=initPos[selectedBody].z.toString();
    posZLabel.textContent = initPos[selectedBody].z.toFixed(4);
});

velXSlider.addEventListener('input', function(ev){
    vXSlider();
});
velXSlider.addEventListener('dblclick', function(ev){
    initVel[selectedBody].x=0;
    velXSlider.value=initVel[selectedBody].x.toString();
    velXLabel.textContent = initVel[selectedBody].x.toFixed(4);
});

velYSlider.addEventListener('input', function(ev){
    vYSlider();
});
velYSlider.addEventListener('dblclick', function(ev){
    initVel[selectedBody].y=0;
    velYSlider.value=initVel[selectedBody].y.toString();
    velYLabel.textContent = initVel[selectedBody].y.toFixed(4);
});

velZSlider.addEventListener('input', function(ev){
    vZSlider();
});
velZSlider.addEventListener('dblclick', function(ev){
    initVel[selectedBody].z=0;
    velZSlider.value=initVel[selectedBody].z.toString();
    velZLabel.textContent = initVel[selectedBody].z.toFixed(4);
});

timeScaleSlider.addEventListener('input', function(ev){
    timeScale = parseInt(timeScaleSlider.value)/1000;
    timeScaleLabel.textContent = timeScale.toFixed(3);
});

radPos.addEventListener('input', function(ev){
    checkVelOrPos(false);
});
radVel.addEventListener('input', function(ev){
    checkVelOrPos(true);
});

function checkVelOrPos(velOrPos){
    showVelocities = velOrPos;
    if(showVelocities)
        for(var i=0;i<objects.length;i++)
            objects[i].innerText = "x:"+balls[i].v.x.toFixed(4)+" y:"+balls[i].v.y.toFixed(4)+" z:"+balls[i].v.z.toFixed(4);
    else
        for(var i=0;i<objects.length;i++)
            objects[i].innerText = "x:"+balls[i].position.x.toFixed(4)+" y:"+balls[i].position.y.toFixed(4)+" z:"+balls[i].position.z.toFixed(4);
}

predefinedSelect.addEventListener('change', function(ev){
    selectedScenario = parseInt(predefinedSelect.value);
    selectScenario(selectedScenario);
});

checkAsStar.addEventListener('change', function(ev){
    asStar = checkAsStar.checked;
    resetBalls();
});



window.addEventListener(
    "keydown", (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if event already handled
      }
  
    //   switch (event.code) {
    //     case "KeyS":
    //     case "ArrowDown":
    //       // Handle "back"
    //       controls.position.set(controls.position.x,controls.position.y-10,controls.position.z);
    //       controls.target.set(controls.target.x,controls.target.y+10,controls.target.z);
    //       break;
    //     case "KeyW":
    //     case "ArrowUp":
    //       // Handle "forward"
    //       controls.position.set(controls.position.x,controls.position.y+10,controls.position.z);
    //       controls.target.set(controls.target.x,controls.target.y+10,controls.target.z);
    //       break;
    //     case "KeyA":
    //     case "ArrowLeft":
    //       // Handle "turn left"
    //       controls.position.set(controls.position.x-10,controls.position.y,controls.position.z);
    //       controls.target.set(controls.target.x-10,controls.target.y,controls.target.z);
    //       break;
    //     case "KeyD":
    //     case "ArrowRight":
    //       // Handle "turn right"
    //       var newPos = new THREE.Vector3(controls.position.x+10,controls.position.y,controls.position.z) 
    //       var newTrg =  new THREE.Vector3(controls.target.x+10,controls.target.y,controls.target.z);
    //       controls.position.set(newPos.x,newPos.y,newPos.z);
    //       controls.target.set(newTrg.x,newTrg.y,newTrg.z);
    //       break;
    //   }
      controls.update();
      //refresh();
  
      if (event.code !== "Tab") {
        // Consume the event so it doesn't get handled twice,
        // as long as the user isn't trying to move focus away
        event.preventDefault();
      }
    },
    true,
);

function selectScenario(sc){
    initMass = scenario[sc].mass;
    initPos = scenario[sc].pos;
    initVel = scenario[sc].vel;
    initialMass = [];
    createOptions();
    resetBalls();
    //generateScene();
    //generateBalls();
    setContents(0);
    checkVelOrPos(true);
    render();
}

//createOptions();
createPredefined();

generateScene();
generateBalls();
//checkVelOrPos(true);
selectScenario(0);
//render();
