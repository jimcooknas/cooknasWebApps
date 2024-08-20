const PI2 = 2 * Math.PI;
const PI_2 = Math.PI / 2;
const PI_3 = Math.PI / 3;
var isRunning = false;
var canvas;
var ctx;
var reqID;
var nest;
var ants = [];
var numOfAnts = 100;
var antSize = 10;
var nestRadius = 20;
var showFero = false;
//ferormones
var feroHome = [];
var feroFood = [];
var feroEvapRate = 0.01;
var grid;
var gridSize = 2;
var rows;
var cols;
//food
var food = [];
var nestFood = 0;
var numOfFood = 8;

window.onload = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 0.98*window.innerWidth;
    canvas.height = 0.97*window.innerHeight;
    setupSimulation();
}

function setupSimulation(){
    numOfAnts = parseInt(document.getElementById("noOfAnts").value);
    food = [];
    ants = [];
    cols = Math.round(canvas.width/gridSize);
    rows = Math.round(canvas.height/gridSize);
    feroHome = new Array(cols);
    feroFood = new Array(cols);
    for(var i=0;i<cols;i++){
        feroHome[i] = new Array(rows);
        feroFood[i] = new Array(rows);
    }
    for(var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
            feroHome[i][j] = 0;
            feroFood[i][j] = 0;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nest = new Victor(canvas.width/2, canvas.height/2);
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, nestRadius, 0, 2*Math.PI);
    ctx.fillStyle = "gray";
    ctx.fill();
    generateFood(numOfFood);
    generateAnts(numOfAnts);
    //reqID = requestAnimationFrame(drawLoop);
}

function getGridByXY(x, y){
    var c = Math.min(cols-1, Math.round(x/gridSize));
    var r = Math.min(rows-1, Math.round(y/gridSize));
    if(c<0)c=0;
    if(r<0)r=0;
    return {col:c, row:r};
}

function generateAnts(num){
    ants = [];

    for(var i=0; i<num; i++){
        var dx = 2*(Math.random()-0.5);
        var dy = 2*(Math.random()-0.5);
        var dir = new Victor(dx,dy);
        var ant = new Ant(nest.x, nest.y, dir.normalize(), antSize);
        //console.log(nest.x+" "+nest.y + " "+dir.toString());
        ants.push(ant);
    }
    ants[0].showSense = true;
    ants[1].showSense = true;
    //ants[0].dir = food[0].clone().subtract(ants[0].pos).normalize();
    //console.log(ants[0].dir);
}

function generateFood(num){
    for(var i = 0; i < num; i++){
        var x = Math.random()*canvas.width;
        var y = Math.random()*canvas.height;
        var v = new Food(x, y, 100);
        food.push(v);
        ctx.beginPath();
        ctx.arc(v.pos.x, v.pos.y, 6, 0, PI2);
        ctx.fillStyle = "#00ff00";
        ctx.fill();
    }
}

function drawLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //set the nest
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, nestRadius, 0, PI2);
    ctx.fillStyle = "gray";
    ctx.fill();
    //set the food
    for(var i = 0; i < food.length; i++){
        if(food[i].strength <= 0)
            food.splice(i,1);
        else
            food[i].show(ctx);
    }
    //set ferormones
    for(var i=0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            if(showFero){
                if(feroFood[i][j]>0 || feroHome[i][j]>0){
                    ctx.beginPath();
                    ctx.rect(i*gridSize, j*gridSize, gridSize, gridSize);
                    ctx.fillStyle = "rgba(255, 0, 0, "+feroFood[i][j]+")";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.rect(i*gridSize, j*gridSize, gridSize, gridSize);
                    ctx.fillStyle = "rgba(0, 0, 255, "+feroHome[i][j]+")";
                    ctx.fill();
                }
            }
            feroFood[i][j] = Math.max(0,feroFood[i][j]-feroEvapRate);
            feroHome[i][j] = Math.max(0,feroHome[i][j]-feroEvapRate);
        }
        
    }
    //set the ants
    for(var i=0; i < ants.length; i++){
        ants[i].update();
        ants[i].show(ctx);
    }
    document.getElementById("nest-food").textContent = nestFood.toString();
    ctx.fillStyle = "black";
    ctx.font = "10px Calibri";
    var si = ctx.measureText(nestFood.toString());
    //console.log(si);
    ctx.fillText(nestFood.toString(), nest.x - si.width/2, nest.y + si.hangingBaseline/4);
    reqID = requestAnimationFrame(drawLoop);
}

function startStop(){
    if(isRunning){
        isRunning = false;
        document.getElementById("startstop").textContent = "Start";
        cancelAnimationFrame(reqID);
    }else{
        isRunning = true;
        document.getElementById("startstop").textContent = "Stop";
        reqID = requestAnimationFrame(drawLoop);
    }
}

function foodNoChanged(e){
    numOfFood = parseInt(document.getElementById("noOfFood").value);
    document.getElementById("noOfFoodValue").textContent = numOfFood.toString();
}

function ferormoneCahnged(){
    showFero = document.getElementById("showFero").checked;
}

function antSizeChanged(){
    antSize = parseInt(document.getElementById("antSize").value);
    document.getElementById("antSizeValue").textContent = antSize.toString();
    for(var i=0; i<numOfAnts;i++){
        ants[i].size = antSize;
    }
}