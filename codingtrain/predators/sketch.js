// Global and instance mode
//https://github.com/processing/p5.js/wiki/Global-and-instance-mode
//As we need a second canvas (apart the one used to draw the p5 sketch) to draw the chart, we have to use the
//instance-mode approach of p5-canvases, that is we have to create two separate sketch loops: one for the main loop (sk)
//where preys and predators are drawn and one for the chart draw (ch)

var canvas;
var ctx;
var divCanvas;
var predatorsNum;
var preysNum;
var ticksPassed;
var btnRunStop;
var preysMutationRateEl;
var predatorsMutationRateEl;
var preysCloneFactorEl;
var chart;
//settings
var numPreys = 100;
var numPredators = 10;
var rangeFoodWeightMin;
var rangeFoodWeightMax;
var rangeFoodPercMin;
var rangeFoodPercMax;
var rangePredWeightMin;
var rangePredWeightMax;
var rangePredPercMin;
var rangePredPercMax;
var rangeSpeedMin;
var rangeSpeedMax;
var rangeMassMin;
var rangeMassMax;
var rangePreyWeightMin;
var rangePreyWeightMax;
var rangePreyPercMin;
var rangePreyPercMax;
var rangePredSpeedMin;
var rangePredSpeedMax;

var isChartShown=false;
var isSettingsShown = false;

var vehicles = [];
var food = [];
var predators = [];
var isRunning = true;
var startFrameCount=0;
var xyPreys = [];
var xyPredators = [];
var chartLabels = [];

var showPerception;
//Reference to main p5-canvas where preys and predators are drawn
var sss;

//The first p5-instance function of p5-canvas, for drawing the preys and predators
const sk = (s) => {
    sss = s;
    s.setup = () => {
        canvas = s.createCanvas(s.windowWidth-250, s.windowHeight-35);
        divCanvas = document.getElementById("canvasDiv");
        canvas.parent(divCanvas);
        showPerception = document.getElementById("showPerception");
        predatorsNum = document.getElementById("predatorsNum");
        preysNum = document.getElementById("preysNum");
        ticksPassed = document.getElementById("ticksPassed");
        btnRunStop = document.getElementById("btnStartStop");
        preysMutationRateEl = document.getElementById("rangePreyMutation");
        preysMutationRateEl.addEventListener("input", function(e){
            document.getElementById("preyMutationValue").textContent = (e.target.value).toString()+"%";
            mr = e.target.value / 100;
        });
        predatorsMutationRateEl = document.getElementById("rangePredatorsMutation");
        predatorsMutationRateEl.addEventListener("input", function(e){
            document.getElementById("predatorsMutationValue").textContent = (e.target.value).toString()+"%";
            mutation_rate = e.target.value / 100;
        });
        preysCloneFactorEl = document.getElementById("rangePreyClone");
        preysCloneFactorEl.addEventListener("input", function(e){
            document.getElementById("preyCloneValue").textContent = (e.target.value).toString();
            prey_clone_factor = e.target.value;
        });
        predatorsCloneFactorEl = document.getElementById("rangePredatorsClone");
        predatorsCloneFactorEl.addEventListener("input", function(e){
            document.getElementById("predatorsCloneValue").textContent = (e.target.value).toString();
            predator_clone_factor = e.target.value;
        });
        //settings
        rangeFoodWeightMin = document.getElementById("rangeFoodWeightMin");
        rangeFoodWeightMax = document.getElementById("rangeFoodWeightMax");
        rangeFoodPercMin = document.getElementById("rangeFoodPercMin");
        rangeFoodPercMax = document.getElementById("rangeFoodPercMax");
        rangePredWeightMin = document.getElementById("rangePredWeightMin");
        rangePredWeightMax = document.getElementById("rangePredWeightMax");
        rangePredPercMin = document.getElementById("rangePredPercMin");
        rangePredPercMax = document.getElementById("rangePredPercMax");
        rangeSpeedMin = document.getElementById("rangeSpeedMin");
        rangeSpeedMax = document.getElementById("rangeSpeedMax");
        rangeMassMin = document.getElementById("rangeMassMin");
        rangeMassMax = document.getElementById("rangeMassMax");
        rangePreyWeightMin = document.getElementById("rangePreyWeightMin");
        rangePreyWeightMax = document.getElementById("rangePreyWeightMax");
        rangePreyPercMin = document.getElementById("rangePreyPercMin");
        rangePreyPercMax = document.getElementById("rangePreyPercMax");
        rangePredSpeedMin = document.getElementById("rangePredSpeedMin");
        rangePredSpeedMax = document.getElementById("rangePredSpeedMax");

        for (var i = 0; i < numPreys; i++) {
            var x = s.random(s.width);
            var y = s.random(s.height);
            vehicles[i] = new Vehicle(s, x, y);
        }

        for (var i = 0; i < numPredators; i++) {
            var x = s.random(s.width);
            var y = s.random(s.height);
            predators[i] = new Predator(s, x, y);
        }

        for (var i = 0; i < 40; i++) {
            var x = s.random(s.width);
            var y = s.random(s.height);
            food.push(s.createVector(x, y));
        }
        startFrameCount=0;
    };

    s.mouseDragged = () => {
        if(s.mouseX > s.width)return;
        vehicles.push(new Vehicle(s, s.mouseX, s.mouseY));
    };

    s.draw = () => {
        if(!isRunning)return;
        s.background(41);
        //10% of time create a new food ...
        if (s.random(1) < 0.1) {
            var x = s.random(s.width);
            var y = s.random(s.height);
            food.push(s.createVector(x, y));
        }
        //... and draw food
        for (var i = 0; i < food.length; i++) {
            s.fill(255, 255, 0);
            s.noStroke();
            s.ellipse(food[i].x, food[i].y, 5, 5);
        }
        //show the preys-predators number and the seconds passed
        predatorsNum.textContent = s.nfc(predators.length);
        preysNum.textContent = s.nfc(vehicles.length);
        ticksPassed.textContent = s.nfc((s.frameCount-startFrameCount)/60, 0);
        //update preys
        var foodWeight=0;
        var foodPerc=0;
        var preyWeight=0;
        var preyPerc=0;
        var preyCount=0;
        for (var i = vehicles.length - 1; i >= 0; i--) {
            vehicles[i].boundaries();
            vehicles[i].behaviors(food);
            vehicles[i].update();
            vehicles[i].display();
            var newVehicle = vehicles[i].clone();
            if (newVehicle != null) {
                vehicles.push(newVehicle);
            }
            if (vehicles[i].dead()) {
                var x = vehicles[i].position.x;
                var y = vehicles[i].position.y;
                food.push(s.createVector(x, y));
                vehicles.splice(i, 1);
            }else{
                foodWeight += vehicles[i].dna[0];
                foodPerc += vehicles[i].dna[2];
                preyWeight += vehicles[i].dna[1];
                preyPerc += vehicles[i].dna[3];
                preyCount++;
            }
        }
        //show the weight and perception for food and enemies of the preys
        if(preyCount==0){
            document.getElementById("foodWeight").textContent = "N/A";
            document.getElementById("foodPerception").textContent = "N/A";
            document.getElementById("preyWeight").textContent = "N/A";
            document.getElementById("preyPerception").textContent = "N/A";
        }else{
            document.getElementById("foodWeight").textContent = s.nfc(foodWeight/preyCount,2);
            document.getElementById("foodPerception").textContent = s.nfc(foodPerc/preyCount,1);
            document.getElementById("preyWeight").textContent = s.nfc(preyWeight/preyCount,2);
            document.getElementById("preyPerception").textContent = s.nfc(preyPerc/preyCount,1);
        }
        //update predators
        for (var i = predators.length - 1; i >= 0; i--) {
            predators[i].boundaries();
            predators[i].behaviors();
            predators[i].update();
            predators[i].display(s);
            var newPredator = predators[i].clone();
            if (newPredator != null) {
                predators.push(newPredator);
            }
            if (predators[i].dead()) {
                var x = predators[i].position.x;
                var y = predators[i].position.y;
                predators.splice(i, 1);
            }
        }
        //update arrays of preys and predators number
        xyPreys.push(vehicles.length);
        xyPredators.push(predators.length);
        chartLabels.push(s.frameCount);
        // if(chart!=undefined && xyPredators.length % 10 == 0){
        //     chart.data.labels = chartLabels;
        //     chart.data.datasets[0].data = xyPreys;
        //     chart.data.datasets[1].data = xyPredators;
        //     chart.update();
        // }
    };
};

//The second instance function of p5-canvas that is used for chart.js drawing
const ch = (st) => {
    var chartCanvas;
    var ctCtx;
    st.setup = () => {
        chartCanvas = document.getElementById("myCanvas");//st.createCanvas(600, 400);
        ctCtx = chartCanvas.getContext('2d');;
        chart = new Chart(ctCtx, {
            type: "line",
            labels: chartLabels,
            data: {
                datasets: [{
                    label:'Preys',
                    pointRadius: 2,
                    fill:false,
                    borderColor: "rgba(0,255,0,1)",
                    data: xyPreys,
                },
                {
                    label:'Predators',
                    pointRadius: 2,
                    fill:false,
                    borderColor: "rgba(255,0,0,1)",
                    data: xyPredators,
                  }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation:false,
                events:[],//'click'
                scales:{
                    xAxes:[{
                        ticks:{
                            maxRotation: 90,
                            minRotation: 90,
                            callback: function(value, index, values){
                                val = parseInt(value)-startFrameCount;
                                var m = Math.floor(val/3600);
                                var sec = ((val-3600*m)/60);
                                return m + ":" + (sec < 10 ? "0" + sec.toFixed(1) : sec.toFixed(1));
                            }
                        }
                    }],
                    yAxes:[{
                        ticks: {
                            callback: function(value, index, values){
                                return value + "#";
                            }
                        },
                    }],
                },
            }
        });
    }

    // st.mouseMove = (e) => {
    //     e.preventDefault();
    // }
    // st.mousePressed = (e) => {
    //     e.preventDefault();
    // }

    st.draw = () => {
        //if(chart!=undefined && xyPredators.length % 10 == 0){
            chart.data.labels = chartLabels;
            chart.data.datasets[0].data = xyPreys;
            chart.data.datasets[1].data = xyPredators;
            chart.update();
        //}
    }
};

//Definition of the two p5 canvas instanses
let myp5 = new p5(sk, 'canvasDiv');
let myp5Chart = new p5(ch, 'canvasChartDiv');

//////////////////////////////////////////////////////////////////////////////////////////
//The other functions of sketch that use the sss p5-context to refer to the p5 main-canvas
//All p5 functions are referenced to sss
//////////////////////////////////////////////////////////////////////////////////////////
function runStop(){
    if(isRunning){
        isRunning=false;
        sss.noLoop();
        btnRunStop.textContent = "Start running";
    }else{
        isRunning=true;
        sss.loop();
        btnRunStop.textContent = "Stop running";
    }
}

function reset(){
    sss.noLoop();
    showSettings();
    startFrameCount = sss.frameCount;
    isRunning = false;
}

function sliderClick(e){
    var str = e.id;
    var strMin = str.replace("Max","").replace("Min","") + "Min";
    var strMax = str.replace("Max","").replace("Min","") + "Max";
    var sliderMin = document.getElementById(strMin);
    var sliderMax = document.getElementById(strMax);
    if(sliderMin === e){
        if(parseInt(sliderMin.value) > parseInt(sliderMax.value)){
            sliderMax.value = e.value;
            document.getElementById(strMax+"Value").textContent = e.value;
        }else{
            document.getElementById(strMin+"Value").textContent = e.value;
        }
    }else if(sliderMax === e){
        if(parseInt(sliderMin.value) > parseInt(sliderMax.value)){
            sliderMin.value = e.value;
            document.getElementById(strMin+"Value").textContent = e.value;
        }else{
            document.getElementById(strMax+"Value").textContent = e.value;
        }
    }
    document.getElementById(e.id+"Value").textContent = e.value;
}

function closeChart(){
    document.getElementsByClassName("overlay")[0].style.display="none";
    isChartShown = false;
}

function showChart(){
    document.getElementsByClassName("overlay")[0].style.display="block";
    isChartShown = true;
}

function showSettings(){
    document.getElementsByClassName("overlay")[1].style.display="block";
    document.getElementsByClassName("popup")[1].style.width = "845px";
    document.getElementsByClassName("popup")[1].style.height = "530px";
    isSettingsShown = true;
}

//when seup is closed (hidden) the re-run main loop with the new parameters
function closeSetup(){
    numPreys = parseInt(document.getElementById("numPreys").value);
    numPredators = parseInt(document.getElementById("numPredators").value);
    document.getElementsByClassName("overlay")[1].style.display="none";
    isSettingsShown = false;
    vehicles = [];
    food = [];
    predators = [];
    for (var i = 0; i < numPreys; i++) {
        var x = sss.random(sss.width);
        var y = sss.random(sss.height);
        vehicles[i] = new Vehicle(sss, x, y);
    }
    for (var i = 0; i < numPredators; i++) {
        var x = sss.random(sss.width);
        var y = sss.random(sss.height);
        predators[i] = new Predator(sss, x, y);
    }
    for (var i = 0; i < 40; i++) {
        var x = sss.random(sss.width);
        var y = sss.random(sss.height);
        food.push(sss.createVector(x, y));
    }
    xyPreys = [];
    xyPredators = [];
    chartLabels = [];
    btnRunStop.textContent = "Stop";
    isRunning = true;
    sss.loop();
}
