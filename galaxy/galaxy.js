//constants
const G = 0.0001;
const PI = Math.PI;
//html elements
var canvas = document.getElementById("rendererCanvas");
var panel = document.getElementById("panel");
var particlesPanel = document.getElementById("particlesPanel");
var panelHandle = document.getElementById("panelHandle");
var oneColorEl = document.getElementById("oneColor");
var ballColorEl = document.getElementById("ballColor");
var txtNumOfBalls = document.getElementById("numOfBalls");
var radiusMinSlider = document.getElementById("minRadiusSlider");
var radiusMaxSlider = document.getElementById("maxRadiusSlider");
var radiusMinLabel = document.getElementById("minRadiusLabel");
var radiusMaxLabel = document.getElementById("maxRadiusLabel");
var checkBoxEl = document.getElementById("checkBox");
var checkBoxRotationEl = document.getElementById("checkBoxRotate");
//var percentEl = document.getElementById("percent");
var panelHidden = false;
var bCheckCollisions = false;
var bRotate = true;
var useSkew = false;
//scene, renderer, camera and lights
var scene;
var renderer;
var camera;
var controls;
var light;
var ambient;
var winResizeListener;
var isRunning = true;
var renderId;
var isParticlesShown = true;
var log = false;
var counter = 0;

//balls variables
var numOfStars = 1;
var ballCount = 5000; // integer
var radius = .025; // size of balls, default value 0.25
var starRadius = 0.05;
var ballRadius = []; // a list of all ball sizes
var ballMass = [];
var minRadius = 0.05; //minimum radius of balls
var maxRadius = 0.05; //maximum radius of balls
var density = 1; //to calculate mass from radius
var range = 10;  // size of enclosing box
var balls = []; //the ball objects on scene
//var group;
var ballGroup;
var boxHelper;
var ballColor;
var speed = .1;//the maximum ball's speed
var rotation = 0.005;

var stars = [];
var starMass = [];

// declare once and modify
var plus = new THREE.Vector3();
var minus = new THREE.Vector3();
var separation = new THREE.Vector3();
var normal = new THREE.Vector3();
var relativeVelocity = new THREE.Vector3();
var starsPos = [[0,0,0],[4,0,0],[-4,0,0],[0,0,4],[0,0,-4]];




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

function generateScene(){
    //create scene object
    scene = new THREE.Scene();
    //create the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: rendererCanvas } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );
    document.body.appendChild( renderer.domElement );
    //create the camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.up.set( 0, 0, 1 );
    camera.position.set( 3.5*range, 0.0, 0.0 );//2, 1.5, 2.5
    //create the controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.zoomSpeed = 2.0;
    controls.panSpeed = 0.4;
    window.removeEventListener( 'resize', winResizeListener);
    window.addEventListener( 'resize', winResizeListener);
    //create box
    var box = new THREE.Geometry();
    box.vertices.push( new THREE.Vector3( -range-1, -range-1, -range-1 ) );
    box.vertices.push( new THREE.Vector3( range+1, range+1, range+1 ) );
    var boxMesh = new THREE.Line( box );
    var mat = new THREE.MeshPhongMaterial();
    mat.color = new THREE.Color("#333355");
    boxHelper = new THREE.BoxHelper( boxMesh, mat );
    scene.add( boxHelper );
    //create lights
    light = new THREE.DirectionalLight( 0xffffff, .8 );
    light.position.set( -range, range, 0 );
    camera.add( light );
    scene.add( camera );
    ambient = new THREE.AmbientLight( 0x555555 );
    scene.add( ambient );
}

function generateStars(numStars){
    var geometry = new THREE.SphereGeometry( 10*starRadius, 20, 20 );
    var material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color("#ff9900");
    // material.transparent=true;
    // material.opacity=0.9;
    stars = [];
    for(var i=0; i < numStars; i++){
        var star = new THREE.Mesh( geometry, material );
        star.position.set(starsPos[i][0], starsPos[i][1], starsPos[i][2]);
        console.log(starsPos[i][0]+" "+starsPos[i][1]+" "+starsPos[i][2]);
        star.v = new THREE.Vector3(0, 0, 0);
        starMass.push(100);
        stars.push(star);
        //scene.add(star);
    }
}

function generateBalls(){
    ballColor = "#ffff00";//ballColorEl.value;
    balls=[];
    //group = undefined;
    ballGroup = new THREE.Group();
    if(boxHelper)ballGroup.add(boxHelper);
    //percentEl.hidden = false;
    for ( var i = 0 ; i < ballCount ; i++ ) {
        ballColor = new THREE.Color("rgb(255, "+(180+75*Math.random()).toFixed(0)+", 0)");
        ballRadius.push(minRadius + (maxRadius - minRadius) * Math.random());
        radius = ballRadius[ballRadius.length-1];
        ballMass.push(radius*radius*radius*density);
        var geometry = new THREE.SphereGeometry( radius, 6, 6 );
        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color(ballColor);
        var ball = new THREE.Mesh( geometry, material );
        // random position
        var r;
        if(useSkew)
            r = random_bm(2*starRadius, 1.5*range, 2);
        else
            r = 1 + ( range - radius ) * Math.random();
        var a = 2*PI*Math.random();
        var x = r * Math.cos(a);//( range - radius ) * ( 2 * Math.random() - 1 );
        var y = r * Math.sin(a);//( range - radius ) * ( 2 * Math.random() - 1 );
        var z = (2.0-4.0*Math.random())/Math.sqrt(x*x+y*y);
        ball.position.set(x, y, z);
        var d = ball.position.distanceTo(stars[0].position);
        var v = Math.sqrt(G*starMass[0]/d);
        ball.v = new THREE.Vector3(v * Math.sin(2*PI-a), v * Math.cos(2*PI-a), 0);
        
        balls.push( ball );
        ballGroup.add(ball);
        //percentEl.textContent = (i*100.0/ballCount).toFixed(1)+"%";
    }
    for(var i=0;i<numOfStars;i++)
        ballGroup.add(stars[i]);
    scene.add(ballGroup);
    numOfCollisions.textContent = 0;
    collisions = 0;
    //percentEl.hidden = true;
}

function render() {
    if(isRunning){
        renderId = requestAnimationFrame(render);
        //if(savingAnim)console.log(animCounter);
        var toDel = [];
        var stopped=0;
        for ( var i = 0 ; i < ballCount ; i++ ) {
            var b1 = balls[i];
            if(b1!=null){
                for(var s = 0; s < numOfStars ; s++){
                    var dir = new THREE.Vector3();
                    dir.copy(stars[s].position).sub(b1.position).normalize();
                    var d = b1.position.distanceTo(stars[s].position);
                    // if(d < starRadius + ballRadius[i]){
                    //     counter++;
                    //     toDel.push([s,i]);
                    //     //break;
                    // }
                    dir.setLength(G*starMass[s]/Math.pow(d,2));
                    b1.v.add(dir);
                }
                // plus.copy( b1.position ).addScalar( ballRadius[i] ).add( b1.v );
                // minus.copy( b1.position ).subScalar( ballRadius[i] ).add( b1.v );
                // // reverse velocity components at walls
                // if ( plus.x > range || minus.x < -range ) b1.v.x = -b1.v.x;
                // if ( plus.y > range || minus.y < -range ) b1.v.y = -b1.v.y;
                // if ( plus.z > range || minus.z < -range ) b1.v.z = -b1.v.z;
                // if(bCheckCollisions){
                //     for ( var j = i + 1 ; j < ballCount ; j++ ) {
                //         var b2 = balls[j];
                //         separation.copy( b1.position ).add( b1.v ).sub( b2.position ).sub( b2.v );
                //         // exchange normal velocities for collision, leave tangential alone
                //         if ( separation.length() <= ballRadius[i] + ballRadius[j] ) {
                //             //from https://www.youtube.com/watch?v=dJNFPv9Mj-Y&t=20s
                //             //var massSum = ballMass[i]+ballMass[j];
                //             //normal.copy( b1.position ).sub( b2.position ).normalize();
                //             //var impactVector = new THREE.Vector3();
                //             //impactVector.copy(normal);
                //             //var d = b1.position.distanceTo(b2.position);
                //             //var overlap = d - (ballRadius[i]+ballRadius[j]);
                //             //var dir = impactVector.setLength(overlap * 0.5);
                //             //b1.position.add(dir);
                //             //b2.position.sub(dir);
                //             //var dist = ballRadius[i]+ballRadius[j];

                //             normal.copy(b1.position).sub(b2.position).normalize();
                //             relativeVelocity.copy(b1.v).sub(b2.v);
                //             var dot = relativeVelocity.dot(normal);
                //             normal = normal.multiplyScalar(dot);
                //             b1.v.sub(normal);//.multiplyScalar(2*ballMass[j]/(massSum*dist*dist)));
                //             b2.v.add(normal);//.multiplyScalar(2*ballMass[i]/(massSum*dist*dist)));
                //             b1.v = b1.v.multiplyScalar(1.0-collLoss/100.0);
                //             b2.v = b2.v.multiplyScalar(1.0-collLoss/100.0);
                //             collisions++;
                //         }
                //     }
                // }
                b1.position.add( b1.v );
                if(b1.v.x==0 && b1.v.y==0 && b1.v.z==0)stopped++;
            }
        }
        console.log("Stopped="+stopped);
        for(var i=toDel.length-1;i>=0;i--){
            balls.splice(toDel[i][1],1);
            starMass[toDel[i][0]] += ballMass[toDel[i][1]];
        }
        numOfCollisions.textContent = counter+"/"+balls.length;
        if(bRotate)
            rotateAroundObjectAxis(ballGroup, new THREE.Vector3(0, 0, 1), rotation);
        renderer.render( scene, camera );
        controls.update();				
    }else{
        renderer.render( scene, camera );
        controls.update();
        renderId = requestAnimationFrame(render);
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

function startStop(){
    isRunning = !isRunning;
    if(isRunning){
        document.getElementById("btnStartStop").value="Stop";
        //render();
        //do not render here. render is already running
    }else{
        document.getElementById("btnStartStop").value="Start";
    }
}

function resetBalls(){
    isRunning = false;
    cancelAnimationFrame(renderId);
    numOfStars = parseInt(document.getElementById("numOfSuns").value);
    for(var i = balls.length-1; i >= 0; i--){
        ballGroup.remove(balls[i]);
    }
    scene.remove(ballGroup);
    //scene.remove(stars[0]);
    //if(group!=undefined)scene.remove(group);
    balls = [];
    stars = [];
    ballCount = parseInt(txtNumOfBalls.value);
    generateStars(numOfStars);
    generateBalls();
    isRunning = true;
    startStop();
    //document.getElementById("btnStartStop").value="Stop";
    isRunning=false;
    startStop();
    counter=0;
    render();
    //do not render() here. The render() is already running continously by the initial call
}

function radiusSlider(){
    minRadius = radiusMinSlider.value/100;
    maxRadius = radiusMaxSlider.value/100;
    radiusMinLabel.textContent = minRadius.toFixed(2);
    radiusMaxLabel.textContent = maxRadius.toFixed(2);
}

function checkBox(){
    if(checkBoxEl.checked){
        ballGroup.add(boxHelper);
    }else{
        ballGroup.remove(boxHelper);
    }
}

function checkRotation(){
    bRotate = checkBoxRotationEl.checked;
}

function numOfSunsSlider(){
    document.getElementById("numOfSunsValue").textContent = parseInt(document.getElementById("numOfSuns").value);
}

function checkBoxSkew(){
    useSkew = document.getElementById("checkBoxSkew").checked;
}

function random_bm(min, max, skew) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) 
      num = random_bm(min, max, skew) // resample between 0 and 1 if out of range
    
    else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
  }

generateScene();
generateStars(numOfStars);
generateBalls();
render();