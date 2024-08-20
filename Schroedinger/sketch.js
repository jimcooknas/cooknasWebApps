// Display options:

var CANVAS_WIDTH  = 1280//1920;
var CANVAS_HEIGHT = 600//1080;
const FRAME_RATE    = 20;
var isRunning = false;
var capturedFrames = -2;

let span;
let selSettings;
let btnStartStop;

let slideSize;
let slideSizeVal;
let slideSizeTitle;

let slideEnergy;
let slideEnergyVal;
let slideEnergyTitle;
let energyValue;

let slideSigma;
let slideSigmaVal;
let slideSigmaTitle;

let slideMedian;
let slideMedianVal;
let slideMedianTitle;

let slideTimestep;
let slideTimestepVal;
let slideTimestepTitle;

let txtPotential;
let txtPotentialTitle;

let chkGradientColor;
let chkSaveData;
let chkSaveImage;

let sliderMaxSteps;
let sliderMaxStepsVal;
let sliderMaxStepsTitle;

let info;

let quantumParticle = null;

let setNames = ['Double Well','Particle in a Box','Ramp Potential','Step Potential','Potential Barrier'];
let potDescr = ['V = 2'+'&times;10<sup>' + 4 + '</sup>&times;'+'[(4&times;x - 1)&times;(4&times;x - 3)]<sup>2</sup>',
				'V = 0',
				'V = 1.2&times;10<sup>' + 5 + '</sup>&times;x',
				'x < 1/2 → V = 0<br>x > 1/2 → V = 5&times;10<sup>5</sup>',
				'x < 0.5 → V = 0<br>0.5 ≤ x ≤0.51 → V = 5&times;10<sup>5</sup><br>x > 0.51 → V = 0'];

let settings = [{
	size:          1024, // size N of the wave function array (must be a power of 2)
	energy:        3.125E+4, // energy E of the initial wave packet (E = k^2/2)
	median:        0.5,  // center of the initial wave packet within the interval (0,1)
	sigma:         0.01, // width of the initial wave packet
	timeStep:      1E-6, // time step Δt of the simulation
	stepsPerFrame: 20,   // number of interation steps per frame
	maxFrames:     1000, // total number of simulation steps
	potential:     x => 2E+4*Math.pow((4*x - 1)*(4*x - 3),2), // potential energy V(x)
	label:         'Double Well', // name of the simulation
	momentumZoom:  4,    // zoom factor for plot of wave function in momentum space 
	scaleFactor:   1,    // scaling factor for the plot of wave function in position space
	underlay:      null, // p5.js graphics buffer for the underlay of the canvas
	dataFile:      'doubleWell', // file name for the simulation data
	imageFile:     null  // file name for capturing of the animation frames
},{
	size:          1024, // size N of the wave function array (must be a power of 2)
	energy:        3.125E+4, // energy E of the initial wave packet (E = k^2/2)
	median:        0.5,  // center of the initial wave packet within the interval (0,1)
	sigma:         0.02, // width of the initial wave packet
	timeStep:      1E-6, // time step Δt of the simulation
	stepsPerFrame: 20,   // number of interation steps per frame
	maxFrames:     1000, // total number of simulation steps
	potential:     x => 0,//2E+4*Math.pow((4*x - 1)*(4*x - 3),2), // potential energy V(x)
	label:         'Particle in a Box', // name of the simulation
	momentumZoom:  4,    // zoom factor for plot of wave function in momentum space 
	scaleFactor:   1,    // scaling factor for the plot of wave function in position space
	underlay:      null, // p5.js graphics buffer for the underlay of the canvas
	dataFile:      'particleInABox', // file name for the simulation data
	imageFile:     null  // file name for capturing of the animation frames
},{
	size:          1024, // size N of the wave function array (must be a power of 2)
	energy:        12.5E+5, // energy E of the initial wave packet (E = k^2/2)
	median:        0.5,  // center of the initial wave packet within the interval (0,1)
	sigma:         0.05, // width of the initial wave packet
	timeStep:      1E-6, // time step Δt of the simulation
	stepsPerFrame: 20,   // number of interation steps per frame
	maxFrames:     1000, // total number of simulation steps
	potential:     x => 1.2E+5*x, // potential energy V(x)
	label:         'Ramp Potential', // name of the simulation
	momentumZoom:  4,    // zoom factor for plot of wave function in momentum space 
	scaleFactor:   1,    // scaling factor for the plot of wave function in position space
	underlay:      null, // p5.js graphics buffer for the underlay of the canvas
	dataFile:      'rampPotential', // file name for the simulation data
	imageFile:     null  // file name for capturing of the animation frames
},{
	size:          1024, // size N of the wave function array (must be a power of 2)
	energy:        3.125E+4, // energy E of the initial wave packet (E = k^2/2)
	median:        0.25,  // center of the initial wave packet within the interval (0,1)
	sigma:         0.05, // width of the initial wave packet
	timeStep:      1E-6, // time step Δt of the simulation
	stepsPerFrame: 20,   // number of interation steps per frame
	maxFrames:     1000, // total number of simulation steps
	potential:     x => x<0.5?0:5E+5, // potential energy V(x)
	label:         'Step Potential', // name of the simulation
	momentumZoom:  4,    // zoom factor for plot of wave function in momentum space 
	scaleFactor:   1,    // scaling factor for the plot of wave function in position space
	underlay:      null, // p5.js graphics buffer for the underlay of the canvas
	dataFile:      'stepPotential', // file name for the simulation data
	imageFile:     null  // file name for capturing of the animation frames
},{
	size:          1024, // size N of the wave function array (must be a power of 2)
	energy:        1E+6, // energy E of the initial wave packet (E = k^2/2)
	median:        0.25,  // center of the initial wave packet within the interval (0,1)
	sigma:         0.05, // width of the initial wave packet
	timeStep:      2.5E-7, // time step Δt of the simulation
	stepsPerFrame: 20,   // number of interation steps per frame
	maxFrames:     1000, // total number of simulation steps
	potential:     x => x<0.5?0:x<0.508?5.0E+5:0, // potential energy V(x)
	label:         'Potential Barrier', // name of the simulation
	momentumZoom:  4,    // zoom factor for plot of wave function in momentum space 
	scaleFactor:   1,    // scaling factor for the plot of wave function in position space
	underlay:      null, // p5.js graphics buffer for the underlay of the canvas
	dataFile:      'potentialBarrier', // file name for the simulation data
	imageFile:     null  // file name for capturing of the animation frames
}];

function windowResized(){
	CANVAS_WIDTH = windowWidth-14;
	CANVAS_HEIGHT = windowHeight - 100;
	resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	background(0);
	span.position(6, 10 + CANVAS_HEIGHT);
	selSettings.position(6, 36 + CANVAS_HEIGHT);
	btnStartStop.position(166, 10 + CANVAS_HEIGHT);
	info.position(10,CANVAS_HEIGHT+60);
	thisSelectEvent();
}

//setup
function setup() {
	frameRate(FRAME_RATE);
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	background(0);
	slideSize = createSlider(10,14,11,1);
	slideSize.hide();
	slideSizeVal=createSpan("10");
	slideSizeVal.hide();
	slideSizeTitle=createSpan('Size=');
	slideSizeTitle.hide();
	slideEnergy = createSlider(0,1000,250,1);
	slideEnergy.hide();
	slideEnergyVal=createSpan("200");
	slideEnergyVal.hide();
	slideEnergyTitle=createSpan('Energy=');
	slideEnergyTitle.hide();
	energyValue=createSpan("E = ");
	energyValue.hide();
	slideSigma = createSlider(0,1,0.5,0.01);
	slideSigma.hide();
	slideSigmaVal=createSpan("0.02");
	slideSigmaVal.hide();
	slideSigmaTitle=createSpan(' σ = ');
	slideSigmaTitle.hide();
	slideMedian = createSlider(0,1,0.5,0.01);
	slideMedian.hide();
	slideMedianVal=createSpan("0.50");
	slideMedianVal.hide();
	slideMedianTitle=createSpan(' μ = ');
	slideMedianTitle.hide();
	slideTimestep = createSlider(1E-8, 1E-6, 1E-6, 0.1E-8);
	slideTimestep.hide();
	slideTimestepVal=createSpan(convertToSciNot(1E-6,2));
	slideTimestepVal.hide();
	slideTimestepTitle=createSpan('δt=');
	slideTimestepTitle.hide();
	txtPotential=createSpan('');
	txtPotential.hide();
	txtPotentialTitle=createSpan('Potential function (V)');
	txtPotentialTitle.hide();
	chkGradientColor = createCheckbox("Gradient color", false);
	chkGradientColor.changed(gradientEvent);
	chkGradientColor.hide();
	chkSaveData = createCheckbox("Save data to file", false);
	chkSaveData.changed(saveDataEvent);
	chkSaveData.hide();
	chkSaveImage = createCheckbox("Save image to file", false);
	chkSaveImage.changed(saveImageEvent);
	chkSaveImage.hide();
	sliderMaxSteps=createSlider(0,5000,1000,100);
	sliderMaxStepsVal=createSpan("1000");
	sliderMaxStepsTitle=createSpan("Max Steps");
	createPanel();
	isRunning = false;
	selSettings.selected("Particle in a Box");
	thisSelectEvent();
	noLoop();
}

function createPanel(){
	//select object label
	span = createSpan('Select scenario');
	span.position(6, 10 + CANVAS_HEIGHT);
	span.style('width','150px');
	span.style('text-align','CENTER');
	span.style('font-size','16px');
	span.style('font-family','Verdana');
	//select object
	selSettings = createSelect();
	selSettings.position(6, 36 + CANVAS_HEIGHT);
	selSettings.style('width', '150px');
	selSettings.style('font-size', '16px');
	selSettings.style('font-family','Verdana');
	for(var i=0; i<setNames.length; i++) 
		selSettings.option(setNames[i]);
	selSettings.changed(thisSelectEvent);
	//button start-stop
	btnStartStop = createButton('Start');
	btnStartStop.style('text-align','CENTER');
	btnStartStop.style('font-size','16px');
	btnStartStop.style('font-family','Verdana');
	btnStartStop.position(166, 10 + CANVAS_HEIGHT);
	btnStartStop.size(80, 50);
	btnStartStop.mousePressed(btnPressed);
	info = createA("./help.html","info","_blank");
	info.position(10,CANVAS_HEIGHT+65);
	info.style('color','red');
	info.style('width', '150px');
	info.style('text-align','CENTER');
	info.style('font-size','14px');
	info.style('font-family','Verdana');
}

function thisSelectEvent(){
	var idx = getSelectedIndex(selSettings.value());
	var sett = settings[idx];
	switch(idx){
		case 0:
			showSize(Math.log(sett.size)/Math.log(2), 250, 60);
			showEnergy(int(Math.sqrt(2*sett.energy)), 320, 100);
			showPotential(idx, 430, 200);
			showSigma(sett.sigma, 630, 70);
			showMedian(sett.median, 710, 70);
			showTimestep(sett.timeStep, 790, 140);
			showGradientColor(chkGradientColor.checked(), 950, 140);
			showSaveData(chkSaveData.checked(), 950, 170);
			showSaveImage(chkSaveImage.checked(), 950, 170);
			showMaxSteps(sett.maxFrames, 1130, 120);
			isRunning=false;
			btnPressed();
			break;
		case 1:
			showSize(Math.log(sett.size)/Math.log(2), 250, 60);
			showEnergy(int(Math.sqrt(2*sett.energy)), 320, 100);
			showPotential(idx, 430, 200);
			showSigma(sett.sigma, 630, 70);
			showMedian(sett.median, 710, 70);
			showTimestep(sett.timeStep, 790, 140);
			showGradientColor(chkGradientColor.checked(), 950, 140);
			showSaveData(chkSaveData.checked(), 950, 170);
			showSaveImage(chkSaveImage.checked(), 950, 170);
			showMaxSteps(sett.maxFrames, 1130, 120);
			isRunning=false;
			btnPressed();
			break;
		case 2:
			showSize(Math.log(sett.size)/Math.log(2), 250, 60);
			showEnergy(int(Math.sqrt(2*sett.energy)), 320, 100);
			showPotential(idx, 430, 200);
			showSigma(sett.sigma, 630, 70);
			showMedian(sett.median, 710, 70);
			showTimestep(sett.timeStep, 790, 140);
			showGradientColor(chkGradientColor.checked(), 950, 140);
			showSaveData(chkSaveData.checked(), 950, 170);
			showSaveImage(chkSaveImage.checked(), 950, 170);
			showMaxSteps(sett.maxFrames, 1130, 120);
			isRunning=false;
			btnPressed();
			break;
		case 3:
			showSize(Math.log(sett.size)/Math.log(2), 250, 60);
			showEnergy(int(Math.sqrt(2*sett.energy)), 320, 100);
			showPotential(idx, 430, 200);
			showSigma(sett.sigma, 630, 70);
			showMedian(sett.median, 710, 70);
			showTimestep(sett.timeStep, 790, 140);
			showGradientColor(chkGradientColor.checked(), 950, 140);
			showSaveData(chkSaveData.checked(), 950, 170);
			showSaveImage(chkSaveImage.checked(), 950, 170);
			showMaxSteps(sett.maxFrames, 1130, 120);
			isRunning=false;
			btnPressed();
			break;
		case 4:
			showSize(Math.log(sett.size)/Math.log(2), 250, 60);
			showEnergy(int(Math.sqrt(2*sett.energy)), 320, 100);
			showPotential(idx, 430, 200);
			showSigma(sett.sigma, 630, 70);
			showMedian(sett.median, 710, 70);
			showTimestep(sett.timeStep, 790, 140);
			showGradientColor(chkGradientColor.checked(), 950, 140);
			showSaveData(chkSaveData.checked(), 950, 170);
			showSaveImage(chkSaveImage.checked(), 950, 170);
			showMaxSteps(sett.maxFrames, 1130, 120);
			isRunning=false;
			btnPressed();
			break;
	}
}

function keyPressed() {
	// this will download the first 10 seconds of the animation!
	// if (key === 's') {
	// 	console.log("Save button pressed");
	// 	capturedFrames=0;
	// 	capturer.start();
	// }
  }

function btnPressed(){
	if(!isRunning){
		isRunning = true;
		btnStartStop.html("Stop");
		var idx = getSelectedIndex(selSettings.value());
		var sett = settings[idx];
		//get the currently selected values
		sett.size = Math.pow(2, slideSize.value());
		sett.energy = Math.pow(slideEnergy.value(),2)/2;
		sett.sigma = slideSigma.value();
		sett.median = slideMedian.value();
		sett.timeStep = slideTimestep.value();
		//continue with the job
		sett.underlay = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
		background(0);
		console.log(sett);
		quantumParticle = new Schroedinger(sett);
		quantumParticle.gradientColor=chkGradientColor.checked();
		quantumParticle.saveDataToFile = chkSaveData.checked();
		quantumParticle.saveImageToFile = chkSaveImage.checked();
		if(chkSaveImage.checked()===true)quantumParticle.imageFile="movie"
		loop();
	}else{
		isRunning = false;
		btnStartStop.html("Start");
		noLoop();
	}
}

function getSelectedIndex(s){
	for(var i=0; i<setNames.length; i++){
		if(setNames[i]==s)return i;
	}
	return -1;
}

function showSize(val, left, w){
	slideSizeTitle.position(left, 10 + CANVAS_HEIGHT);
	slideSizeTitle.style('width','30px');
	slideSizeTitle.style('text-align','CENTER');
	slideSizeTitle.style('font-size','14px');
	slideSizeTitle.style('font-family','Verdana');
	slideSizeTitle.show();

	slideSizeVal.html(val.toString());
	slideSizeVal.position(left+40, 10 + CANVAS_HEIGHT);
	slideSizeVal.style('width','20px');
	slideSizeVal.style('text-align','CENTER');
	slideSizeVal.style('font-size','16px');
	slideSizeVal.style('font-family','Verdana');
	slideSizeVal.show();

	slideSize.position(left, 36 + CANVAS_HEIGHT);
	slideSize.value(val);
	slideSize.style('width', w.toString()+"px");
	slideSize.show();
	slideSize.input(()=>{
		slideSizeVal.html(slideSize.value().toString());
		if(quantumParticle!=null){
			//quantumParticle.setSize(slideSize.value());
			isRunning=false;
			btnPressed();
		}
	});

}

function showEnergy(val, left, w){
	slideEnergyTitle.position(left, 10 + CANVAS_HEIGHT);
	slideEnergyTitle.style('width','30px');
	slideEnergyTitle.style('text-align','CENTER');
	slideEnergyTitle.style('font-size','14px');
	slideEnergyTitle.style('font-family','Verdana');
	slideEnergyTitle.show();

	slideEnergyVal.html(val.toString());
	slideEnergyVal.position(left+70, 10 + CANVAS_HEIGHT);
	slideEnergyVal.style('width','20px');
	slideEnergyVal.style('text-align','CENTER');
	slideEnergyVal.style('font-size','16px');
	slideEnergyVal.style('font-family','Verdana');
	slideEnergyVal.show();

	slideEnergy.position(left, 36 + CANVAS_HEIGHT);
	slideEnergy.value(val);
	slideEnergy.style('width', w.toString()+"px");//"'"+w+"px'");
	slideEnergy.show();
	slideEnergy.input(()=>{
		slideEnergyVal.html(slideEnergy.value().toString());
		energyValue.html("E = "+convertToSciNot(slideEnergy.value()*slideEnergy.value()/2, 2));
		isRunning=false;
		btnPressed();
	});
	energyValue.position(left,54+CANVAS_HEIGHT);
	energyValue.html("E = "+convertToSciNot(val*val/2, 2));
	energyValue.style('width', w.toString()+'px');
	energyValue.style('text-align','CENTER');
	energyValue.style('font-size','12px');
	energyValue.style('font-family','Verdana');
	energyValue.style('background-color', color(200,200,200));
	energyValue.show();
}

function showPotential(val, left, w){
	txtPotentialTitle.position(left, 10 + CANVAS_HEIGHT);
	txtPotentialTitle.style('width', w.toString()+'px');
	txtPotentialTitle.style('text-align','CENTER');
	txtPotentialTitle.style('font-size','14px');
	txtPotentialTitle.style('font-family','Verdana');
	txtPotentialTitle.show();
	txtPotential.style('width', w.toString()+"px");
	txtPotential.style('text-align','CENTER');
	txtPotential.style('height', "50px");
	txtPotential.style('font-size','12px');
	txtPotential.style('font-family','Verdana');
	txtPotential.html(potDescr[val]);
	txtPotential.position(left, 28 + CANVAS_HEIGHT);
	colorMode(RGB, 255);
	txtPotential.style('background-color',color(200,200,200));
	txtPotential.show();
}

function showSigma(val, left, w){
	slideSigmaTitle.position(left, 10 + CANVAS_HEIGHT);
	slideSigmaTitle.style('width','30px');
	slideSigmaTitle.style('text-align','CENTER');
	slideSigmaTitle.style('font-size','14px');
	slideSigmaTitle.style('font-family','Verdana');
	slideSigmaTitle.show();

	slideSigmaVal.html(round(val,2).toString());
	slideSigmaVal.position(left+40, 10 + CANVAS_HEIGHT);
	slideSigmaVal.style('width','20px');
	slideSigmaVal.style('text-align','CENTER');
	slideSigmaVal.style('font-size','16px');
	slideSigmaVal.style('font-family','Verdana');
	slideSigmaVal.show();

	slideSigma.position(left, 36 + CANVAS_HEIGHT);
	slideSigma.value(val);
	slideSigma.style('width', w.toString()+"px");//"'"+w+"px'");
	slideSigma.show();
	slideSigma.input(()=>{
		slideSigmaVal.html(round(slideSigma.value(),2).toString());
		isRunning=false;
		btnPressed();
	});
}

function showMedian(val, left, w){
	slideMedianTitle.position(left, 10 + CANVAS_HEIGHT);
	slideMedianTitle.style('width','30px');
	slideMedianTitle.style('text-align','CENTER');
	slideMedianTitle.style('font-size','14px');
	slideMedianTitle.style('font-family','Verdana');
	slideMedianTitle.show();

	slideMedianVal.html(round(val,2).toString());
	slideMedianVal.position(left+40, 10 + CANVAS_HEIGHT);
	slideMedianVal.style('width','20px');
	slideMedianVal.style('text-align','CENTER');
	slideMedianVal.style('font-size','16px');
	slideMedianVal.style('font-family','Verdana');
	slideMedianVal.show();

	slideMedian.position(left, 36 + CANVAS_HEIGHT);
	slideMedian.value(val);
	slideMedian.style('width', w.toString()+"px");//"'"+w+"px'");
	slideMedian.show();
	slideMedian.input(()=>{
		slideMedianVal.html(round(slideMedian.value(),2).toString());
		isRunning=false;
		btnPressed();
	});
}

function showTimestep(val, left, w){
	slideTimestepTitle.position(left, 12 + CANVAS_HEIGHT);
	slideTimestepTitle.style('width','30px');
	slideTimestepTitle.style('text-align','CENTER');
	slideTimestepTitle.style('font-size','14px');
	slideTimestepTitle.style('font-family','Verdana');
	slideTimestepTitle.show();

	slideTimestepVal.html(convertToSciNot(val,2));
	slideTimestepVal.position(left+30, 10 + CANVAS_HEIGHT);
	slideTimestepVal.style('width','110px');
	slideTimestepVal.style('text-align','CENTER');
	slideTimestepVal.style('font-size','16px');
	slideTimestepVal.style('font-family','Verdana');
	slideTimestepVal.show();

	slideTimestep.position(left, 36 + CANVAS_HEIGHT);
	slideTimestep.value(val);
	slideTimestep.style('width', w.toString()+"px");
	slideTimestep.show();
	slideTimestep.input(()=>{
		slideTimestepVal.html(convertToSciNot(slideTimestep.value(),2));
		if(quantumParticle!=null)quantumParticle.setTimestep(slideTimestep.value());
	});
}

function showGradientColor(gradColor, left, w){
	chkGradientColor.position(left, 10 + CANVAS_HEIGHT);
	chkGradientColor.style('width', w.toString()+'px');
	chkGradientColor.style('text-align','LEFT');
	chkGradientColor.style('font-size','16px');
	chkGradientColor.style('font-family','Verdana');
	chkGradientColor.checked(gradColor);
	chkGradientColor.show();
}

function showSaveData(saveData, left, w){
	chkSaveData.position(left, 30 + CANVAS_HEIGHT);
	chkSaveData.style('width', w.toString()+'px');
	chkSaveData.style('text-align','LEFT');
	chkSaveData.style('font-size','16px');
	chkSaveData.style('font-family','Verdana');
	chkSaveData.checked(saveData);
	chkSaveData.show();
}

function showSaveImage(saveImage, left, w){
	chkSaveImage.position(left, 50 + CANVAS_HEIGHT);
	chkSaveImage.style('width', w.toString()+'px');
	chkSaveImage.style('text-align','LEFT');
	chkSaveImage.style('font-size','16px');
	chkSaveImage.style('font-family','Verdana');
	chkSaveImage.checked(saveImage);
	chkSaveImage.show();
}

function showMaxSteps(val, left, w){
	sliderMaxStepsTitle.position(left, 10 + CANVAS_HEIGHT);
	sliderMaxStepsTitle.style('width','80px');
	sliderMaxStepsTitle.style('text-align','CENTER');
	sliderMaxStepsTitle.style('font-size','14px');
	sliderMaxStepsTitle.style('font-family','Verdana');
	sliderMaxStepsTitle.show();

	sliderMaxStepsVal.html(val.toString());
	sliderMaxStepsVal.position(left+80, 10 + CANVAS_HEIGHT);
	sliderMaxStepsVal.style('width','40px');
	sliderMaxStepsVal.style('text-align','CENTER');
	sliderMaxStepsVal.style('font-size','16px');
	sliderMaxStepsVal.style('font-family','Verdana');
	sliderMaxStepsVal.show();

	sliderMaxSteps.position(left, 36 + CANVAS_HEIGHT);
	sliderMaxSteps.value(val);
	sliderMaxSteps.style('width', w.toString()+"px");
	sliderMaxSteps.show();
	sliderMaxSteps.input(()=>{
		sliderMaxStepsVal.html(sliderMaxSteps.value().toString());
		if(quantumParticle!=null){
			quantumParticle.maxFrames = sliderMaxSteps.value();
		}
	});
}

function convertToSciNot(number, precision) {
	if (number == 0){
      return 0;
	}else{
		power = Math.round(Math.log10(number), 0);
		mantissa = (number / (Math.pow(10, power))).toFixed(precision);
		return mantissa + ' &times; 10<sup>' + power + '</sup>';
	}
}

function gradientEvent(){
	if(quantumParticle){
		quantumParticle.gradientColor = chkGradientColor.checked();
	}
}

function saveDataEvent(){
	if(quantumParticle){
		quantumParticle.saveDataToFile = chkSaveData.checked();
	}
}

function saveImageEvent(){
	if(quantumParticle){
		quantumParticle.saveImageToFile = chkSaveImage.checked();
	}
}

// Draw loop:
function draw() {
	if(quantumParticle) quantumParticle.simulationStep();
}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}