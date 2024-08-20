var canvas;
var ctx;
var requestId;
var isRunning = true;

var beta = 0.3; // the beta coefficient //****from slider
var n = 1000; //number of particles //****from slider
var dt = 0.02; //the time step of simulation
var frictionHalfLife = 0.040; //****from slider
var rMax = 0.1; //the max radius of force interference (0.4) //****from slider
var m = 6; //number of different colors //****from slider
var matrix; // the matrix of color forces
var frictionFactor = Math.pow(0.5, dt/frictionHalfLife);
var forceFactor = 10;

var colors;
var positionX;
var positionY;
var velocityX;
var velocityY;

var tabl;

//when page is loaded, create all needed elements and initialize variables
window.addEventListener("load", (e)=>{
    canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext("2d");

    init(0);
    isRunning = true;
    requestId = requestAnimationFrame(loop);
});

function init(type){
    n = document.getElementById("numOfParticlesSlider").value;
    m = document.getElementById("numSpeciesSlider").value;
    beta = document.getElementById("betaSlider").value/10;

    if(type == 0)
        matrix = makeRandomMatrix();
    else
        matrix = getMatrixFromText();
    colors = new Int32Array(n);
    positionX = new Float32Array(n);
    positionY = new Float32Array(n);
    velocityX = new Float32Array(n);
    velocityY = new Float32Array(n);
    for(let i = 0; i < n; i++){
        colors[i] = Math.floor(Math.random() * m);
        positionX[i] = Math.random();
        positionY[i] = Math.random();
        velocityX[i] = 0;
        velocityY[i] = 0;
    }
    
    createColorsTable();
}

function makeRandomMatrix(){
    const rows = [];
    for(let i = 0; i < m ; i++){
        const row = [];
        for(let j = 0; j < m; j++){
            row.push(Math.random() * 2 - 1);
        }
        rows.push(row);
    }
    return rows;
}

function getMatrixFromText(){
    const rows = [];
    for(let i = 0; i < m ; i++){
        const row = [];
        for(let j = 0; j < m; j++){
            var val = document.getElementById("txt"+i.toString()+j.toString()).value;// = document.getElementById("colors").children[0].value;
            row.push(parseFloat(val));
        }
        rows.push(row);
    }
    //console.log(rows);
    return rows;
}

function force(r, a){
    if(r < beta){
        return r / beta - 1;
    }else if (beta < r && r < 1){
        return a * (1-Math.abs(2 * r -1 - beta)/(1 - beta));
    }else{
        return 0;
    }
}

function updateParticles(){
    //update velocities
    for(let i = 0 ; i < n ; i++){
        let totalForceX = 0;
        let totalForceY = 0;
        toCalc = false;
        for(let j = 0 ; j < n ; j++){
            if(j === i) { toCalc = false; continue; }
            const rx = positionX[j] % 1 - positionX[i] % 1;
            const ry = positionY[j] % 1 - positionY[i] % 1;
            const r = Math.hypot(rx, ry);
            if(r > 0 && r < rMax){
                const f = force(r / rMax, matrix[colors[i]][colors[j]]);
                totalForceX += rx / r * f;
                totalForceY += ry / r * f;
                toCalc = true;
            }
        }
        if(toCalc){
            totalForceX *= rMax * forceFactor;
            totalForceY *= rMax * forceFactor;
            velocityX[i] *= frictionFactor;
            velocityY[i] *= frictionFactor;
            velocityX[i] += totalForceX * dt;
            velocityY[i] += totalForceY * dt;
        }
    }
    //update positions
    for(let i = 0 ; i < n ; i++){
        positionX[i] += velocityX[i] * dt;
        positionY[i] += velocityY[i] * dt;
    }
}

function loop(){
    if(!isRunning)return;
    //update particles
    updateParticles();
    //draw particles
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0 ; i < n ; i++){
        ctx.beginPath();
        const screenX = (positionX[i] > 1 ? positionX[i] % 1 : positionX[i] < 0 ? 1 + positionX[i] % 1 : positionX[i]) * canvas.width;
        const screenY = (positionY[i] > 1 ? positionY[i] % 1 : positionY[i] < 0 ? 1 + positionY[i] % 1 : positionY[i]) * canvas.height;
        ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${360 * (colors[i] / m)}, 100%, 50%)`;
        ctx.fill();
    }

    requestId = requestAnimationFrame(loop);
}

function distance(i,j){
    var x = positionX[j] % 1 - positionX[i] % 1;
    var y = positionY[j] % 1 - positionY[i] % 1;
    return Math.sqrt(x*x + y*y);
}
function setFrictionFactor(){
    frictionFactor = Math.pow(0.5, dt/frictionHalfLife);
}

function getColor(i){
    return `hsl(${360 * (colors[i] / m)}, 100%, 50%)`;
}

function halfTimeChanged(){
    var val = document.getElementById("halfTimeSlider").value;
    document.getElementById("halfTimeLabel").textContent = "Half Time ("+(val/100).toFixed(2)+")";
    frictionHalfLife = val / 100;
    setFrictionFactor();
    //init();
}

function rMaxChanged(){
    var val = document.getElementById("rMaxSlider").value;
    document.getElementById("rMaxLabel").textContent = "Max Distance ("+(val/100).toFixed(2)+")";
    rMax = val / 100;
    setFrictionFactor();
    //init();
}

function numSpeciesChanged(){
    var val = document.getElementById("numSpeciesSlider").value;
    document.getElementById("numSpeciesLabel").textContent = "Num of Species ("+val+")";
    m = val;
    setFrictionFactor();
    init(0);
}

function betaChanged(){
    var val = document.getElementById("betaSlider").value/10;
    document.getElementById("betaLabel").textContent = "Beta value ("+val+")";
    beta = val;
}

function numParticlesChanged(){
    var val = document.getElementById("numOfParticlesSlider").value;
    document.getElementById("numOfParticlesLabel").textContent = "# of Particles ("+val+")";
    n = val;
    init(1);
}

function roundTo(num, precision){
    const factor = Math.pow(10, precision)
    return Math.round(num * factor) / factor
}

function startStop(){
    if(isRunning){
        isRunning = false;
        cancelAnimationFrame(requestId);
        document.getElementById("startStop").textContent = "Start";
        document.getElementById("rerun").disabled = false;
        document.getElementById("reset").disabled = false;
    }else{
        isRunning = true;
        requestId = requestAnimationFrame(loop);
        document.getElementById("startStop").textContent = "Stop";
        document.getElementById("rerun").disabled = true;
        document.getElementById("reset").disabled = true;
    }
}

function reRun(){
    cancelAnimationFrame(requestId);
    init(1);
    isRunning=true;
    document.getElementById("startStop").textContent = "Stop";
    document.getElementById("rerun").disabled = true;
    document.getElementById("reset").disabled = true;
    requestId = requestAnimationFrame(loop);
}

function reSet(){
    cancelAnimationFrame(requestId);
    init(0);
    isRunning=true;
    document.getElementById("startStop").textContent = "Stop";
    document.getElementById("rerun").disabled = true;
    document.getElementById("reset").disabled = true;
    requestId = requestAnimationFrame(loop);
}

function createColorsTable(){
    if(!tabl)
        tabl = document.getElementById("colors");
    else
        tabl.innerHTML = ``;
    tabl.style.width = "100%";
    tabl.style.fontSize="6px";
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    tr.appendChild(td);
    for(var i = 0; i < m; i++){
        var td = document.createElement("td");
        td.innerHTML = "&nbsp;&nbsp;";
        td.style.backgroundColor = `hsl(${360 * (i / m)}, 100%, 50%)`
        tr.appendChild(td);
    }
    tabl.appendChild(tr);
    for(var i = 0; i < m; i++){
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.innerHTML = "&nbsp;";
        td.style.backgroundColor = `hsl(${360 * (i / m)}, 100%, 50%)`
        tr.appendChild(td);
        for(var j = 0; j < m; j++){
            var td = document.createElement("td");
            //td.textContent = matrix[i][j].toFixed(2);
            var txt = document.createElement("input");
            txt.id = "txt"+i.toString()+j.toString();
            txt.type = "text";
            //console.log(""+i+","+j+"="+matrix[i][j]);
            txt.value = matrix[i][j].toFixed(2);
            txt.style.fontSize="6px"
            //txt.style.width = "100%";
            txt.style.maxWidth="90%";
            txt.style.padding="0px";
            txt.style.textAlign = "center";
            td.appendChild(txt);
            var w = txt.style.width-4;
            var sld = document.createElement("input");
            sld.type = "range";
            sld.id = "sld"+i.toString()+j.toString();
            sld.classList.add("slider");
            sld.min="-1.00";
            sld.max="1.00";
            sld.style.height = "4px";
            sld.step = "0.01";
            //sld.style.maxWidth="80%";
            sld.style.width = w;
            sld.style.padding = "0px 0px;"
            sld.style.margin="0px 0px 0px -1px";
            sld.value = matrix[i][j].toFixed(2);
            sld.addEventListener("input", (e) =>{
                var id = e.target.id.substring(3,5);
                //console.log(e.target.id+" "+id);
                document.getElementById("txt"+id).value = roundTo(e.target.value, 2).toFixed(2);
            });
            td.appendChild(sld);
            td.style.textAlign = "center";
            tr.appendChild(td);
        }
        tabl.appendChild(tr);
    }
}