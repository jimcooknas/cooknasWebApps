var requestID;
var upCanvas;
var downCanvas;
var sensorCanvas;
var ctxUp;
var ctxDown;
var ctxSensor;
var btnStartStop;
var btnRestart;
var beamsEl;
var slitDistanceEl;
var frequencyEl;

var slitWidth = 5;
var slitDistance = 50;
var canvasWidth = 800;
var upHeight = 200;
var downHeight = 350;
var sensorHeight = 50;

var freq = 30;
var stdDev = 10;
var beams = [];
var beamsDown = [];
var points = [];
var slits = [];
var counter = 0;
var isRunning = false;
var sensors = [];
var sensorCounter = 0;
var zero;


window.onload = function() {
    upCanvas = document.getElementById("mainCanvas");
    upCanvas.width = canvasWidth;
    upCanvas.height = upHeight;
    downCanvas = document.getElementById("bottomCanvas");
    downCanvas.width = canvasWidth;
    downCanvas.height = downHeight;
    sensorCanvas = document.getElementById("sensorCanvas");
    sensorCanvas.width = canvasWidth;
    sensorCanvas.height = sensorHeight;

    ctxUp = upCanvas.getContext("2d");
    ctxDown = downCanvas.getContext("2d");
    ctxSensor = sensorCanvas.getContext("2d");

    //upCanvas.addEventListener("click", sendBeam);

    btnStartStop = document.getElementById("startstop");
    btnStartStop.addEventListener("click", sendBeam);
    btnRestart = document.getElementById("restart");
    btnRestart.addEventListener("click", reStart);
    beamsEl = document.getElementById("beams");
    slitDistanceEl = document.getElementById("slitDistance");
    frequencyEl = document.getElementById("frequency");
    document.getElementById("clearSensor").addEventListener("click", function(e){
        sensors = [];
        sensorCounter = 0;
        ctxSensor.clearRect(0,0,sensorCanvas.width, sensorCanvas.height);
    });

    slits.push((downCanvas.width-slitDistance)/2+slitWidth/2);
    slits.push((downCanvas.width+slitDistance+slitWidth)/2+slitWidth/2);
    beams = [];
    beamsDown = [];
    sensors = [];
    drawLoop();
    cancelAnimationFrame(requestID);
}


function drawLoop(timeStamp){
    ctxUp.clearRect(0, 0, upCanvas.width, upCanvas.height);
    ctxDown.clearRect(0, 0, downCanvas.width, downCanvas.height);
    //1st slit
    ctxUp.fillStyle = "#ffffff";
    ctxUp.beginPath();
    ctxUp.rect(0, 5, upCanvas.width/2-slitWidth/2, 5);
    ctxUp.rect(upCanvas.width/2+slitWidth/2, 5, upCanvas.width/2-slitWidth/2, 5);
    ctxUp.fill();
    //2 - slits
    ctxDown.fillStyle = "#ffffff";
    ctxDown.beginPath();
    ctxDown.fillRect(0, 0, (downCanvas.width-slitDistance)/2-slitWidth/2, 5);
    ctxDown.fillRect((downCanvas.width-slitDistance)/2+slitWidth/2, 0, slitDistance,5);
    ctxDown.fillRect((downCanvas.width+slitDistance + slitWidth)/2 + slitWidth, 0, (downCanvas.width-slitDistance)/2-slitWidth/2, 5);
    ctxDown.fill();
    sensors = [];
    beams = beams.filter(function(item){
        return item.alive;
    });
    for(var i = 0; i < beams.length; i++){
        if(beams[i].radius <= beams[i].maxRadius){
            beams[i].draw();
            beams[i].update();
        }else{
            beams[i].alive = false;
        }
        if(beams[i].radius >= beams[i].endHeight && !beams[i].passedThroughSlit && beams[i].ctx == ctxUp){
            //console.log("touching r="+beams[i].radius);
            beams[i].passedThroughSlit = true;
            var beam = new Beam(ctxDown, [slits[0], 5], 4, 400, [], downCanvas.width*1.5, downCanvas.height*1.5);
            beamsDown.push(beam); 
            var beam1 = new Beam(ctxDown, [slits[1], 5], 4, 400, [], downCanvas.width*1.5, downCanvas.height*1.5);
            beamsDown.push(beam1); 
        }
    }
    beamsDown = beamsDown.filter(function(item){
        return item.alive;
    });
    for(var i = 0; i < beamsDown.length; i++){
        if(beamsDown[i].radius <= beamsDown[i].maxRadius){
            beamsDown[i].draw();
            beamsDown[i].update();
            var atSensor = beamAtSensor(beamsDown[i], beamsDown);
            if(atSensor.length>0){
                //console.log(atSensor);
                ctxDown.strokeStyle = "white";
                for(var s=0; s < atSensor.length; s++){
                    sensors.push(atSensor[s]);
                }
            }
        }else{
            beamsDown[i].alive = false;
        }
    }
    if(sensors.length>0)sensorCounter += sensors.length;
    for(var i = 0; i < sensors.length; i++){
        ctxSensor.fillStyle = "#ffffff77";
        ctxSensor.beginPath();
        ctxSensor.rect(sensors[i][0], sensors[i][1], 1, 1);
        ctxSensor.fill();
    }
    if(counter>0 && counter % freq == 0){
        var beam2 = new Beam(ctxUp, [upCanvas.width/2, 10], 4, upCanvas.height, [(downCanvas.width-slitDistance)/2+slitWidth/2, (downCanvas.width+slitDistance+slitWidth)/2+slitWidth-slitWidth/2], upCanvas.width, upCanvas.height);
        beams.push(beam2);
    }
    beamsEl.textContent = sensorCounter.toString();
    //timer of the game
    if(zero === undefined){
        zero = timeStamp;
    }
    const elapsed = timeStamp - zero;
    if(elapsed>0)document.getElementById("timer").textContent = getTimeString(elapsed);
    counter++
    requestID = requestAnimationFrame(drawLoop);
}

function slitDistanceChanged(){
    slitDistance = parseInt(slitDistanceEl.value);
    document.getElementById("slitDistanceValue").textContent = slitDistance.toString();
    slits = [];
    slits.push((downCanvas.width-slitDistance)/2+slitWidth/2);
    slits.push((downCanvas.width+slitDistance+slitWidth)/2+slitWidth/2);
    drawLoop();
    cancelAnimationFrame(requestID);
}

function frequencyChanged(){
    freq = parseInt(frequencyEl.value);
    document.getElementById("frequencyValue").textContent = freq.toString();
}

function sendBeam(){
    if(isRunning){
        btnStartStop.textContent = "Start";
        isRunning=false;
        cancelAnimationFrame(requestID);
    }else{
        //var beam = new Beam(ctxUp, [upCanvas.width/2, 10], 4, upCanvas.height, [(downCanvas.width-slitDistance)/2+slitWidth/2, (downCanvas.width+slitDistance+slitWidth)/2+slitWidth-slitWidth/2], upCanvas.width, upCanvas.height);
        //beams.push(beam);
        btnStartStop.textContent = "Stop";
        isRunning=true;
        requestID = requestAnimationFrame(drawLoop);
    }
}

function reStart(){
    if(requestID!=undefined)cancelAnimationFrame(requestID);
    slits.push((downCanvas.width-slitDistance)/2+slitWidth/2);
    slits.push((downCanvas.width+slitDistance+slitWidth)/2+slitWidth/2);
    beams = [];
    beamsDown = [];
    sensors = [];
    isRunning = true;
    btnStartStop.textContent = "Stop";
    sensors = [];
    sensorCounter = 0;
    zero = undefined;
    ctxSensor.clearRect(0,0,sensorCanvas.width, sensorCanvas.height);
    requestID = requestAnimationFrame(drawLoop);
}

function beamAtSensor(beam, allBeams){
    var ret = [];
    for(var i = 0; i < allBeams.length; i++){
        var cos = (slitDistance*slitDistance+allBeams[i].radius*allBeams[i].radius-beam.radius*beam.radius)/(2*slitDistance*allBeams[i].radius);
        var h = Math.round(allBeams[i].radius * Math.sqrt(1 - cos*cos));
        //console.log(h);
        if(Math.abs(h-downCanvas.height) < 2){
            //ret.push(allBeams[i].radius*(slitDistance*slitDistance+allBeams[i].radius*allBeams[i].radius-beam.radius*beam.radius)/(2*slitDistance*allBeams[i].radius));
            var x = gaussian(Math.round(canvasWidth/2 + allBeams[i].radius * cos), stdDev);
            ret.push([x(), sensorHeight*Math.random()]);
            var x1 = gaussian(Math.round(canvasWidth/2 - allBeams[i].radius * cos), stdDev);
            ret.push([x1(), sensorHeight*Math.random()]);
        }
    }
    return ret;
}

//https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// returns a gaussian random function with the given mean and stdev.
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        } else {
            var x1, x2, w;
            do {
            x1 = 2.0 * Math.random() - 1.0;
            x2 = 2.0 * Math.random() - 1.0;
            w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }
  
        var retval = mean + stdev * y1;
        if (retval > 0)
            return retval;
        return -retval;
    }
}

/* test
// make a standard gaussian variable.     
var standard = gaussian(100, 15);

// make a bunch of standard variates
for (i = 0; i < 1000; i++) {
    console.log( standard() )
}
*/

function getTimeString(t){
    var ti = Math.floor(t/1000);
    var h = Math.floor(ti/3600);
    var m = Math.floor((ti - h*3600)/60);
    var s = ti-h*3600-m*60;
    return h.toString()+":"+(m > 9 ? m.toString() : "0" + m.toString()) + ":" + (s > 9 ? s.toString() : "0" + s.toString());
}