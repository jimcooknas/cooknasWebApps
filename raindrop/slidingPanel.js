var canvas;
var canvasStatic;
var ctx;
var ctxStatic;
var drops;
var dropsStatic;
var dropGenerator=0;
var minSpeed = 1
var maxSpeed = 2;
var loopCounter=0;
var isRunning = false;
var request_id;
var density;
var avg_speed;
var trailSpeedEl;
var trailSpeed = 1;
var trailWidth = 80;
var panHeightEl;
var panHeight;
var pan;
var panStatic;
var lblDrops;
var lblCollected;
var lblDropsStatic;
var lblCollectedStatic;
var collectedDrops=0;
var collectedDropsStatic=0;
var isCounting = false;

var lblRuns;
var lblMovingDrops;
var lblStaticDrops;
var lblRatio;

//when page is loaded, create all needed elements and initialize variables
window.addEventListener("load", (e)=>{
    //createStyles("left");

    var panel = document.getElementsByClassName("hamburger-menu")[0];
    addPanelElement("div", "txtDiv1", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl1", "txtDiv1", "Drops Density", "menu__label");
    addPanelElement("input text", "txtDensity", "txtDiv1", "50", "menu__text");

    addPanelElement("div", "txtDiv2", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl2", "txtDiv2", "Rain Speed", "menu__label");
    addPanelElement("input text", "txtSpeed", "txtDiv2", "1", "menu__text");

    addPanelElement("div", "txtDiv2a", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl2a", "txtDiv2a", "Trail Speed", "menu__label");
    trailSpeedEl = addPanelElement("input text", "txtTrailSpeed", "txtDiv2a", "1", "menu__text");

    addPanelElement("div", "txtDiv2b", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl2b", "txtDiv2b", "Pan Height", "menu__label");
    panHeightEl = addPanelElement("input text", "txtPanHeight", "txtDiv2b", "25", "menu__text");
    
    var line = document.createElement("div");
    line.style.width = "240px";
    line.style.height="4px";
    line.style.backgroundColor = "black";
    document.getElementById("panelBox").appendChild(line);

    addPanelElement("div", "txtDiv3", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl3", "txtDiv3", "Runs: ", "menu__label");
    lblRuns = addPanelElement("label", "lblRuns", "txtDiv3", "0", "menu__label");

    addPanelElement("div", "txtDiv4", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl4", "txtDiv4", "Moving - drops collected: ", "menu__label");
    lblMovingDrops = addPanelElement("label", "lblMovingDrops", "txtDiv4", "0", "menu__label");

    addPanelElement("div", "txtDiv5", "panelBox", "", "menu__center");
    addPanelElement("label", "lbl5", "txtDiv5", "Static - drops collected: ", "menu__label");
    lblStaticDrops = addPanelElement("label", "lblStaticDrops", "txtDiv5", "0", "menu__label");

    var lab = addPanelElement("label", "lbl6", "panelBox", "Drops Ratio (Moving/Static):", "menu__center__center");
    lab.style.fontSize = "18px";
    addPanelElement("div", "txtDiv7", "panelBox", "", "menu__center__center");
    lblRatio = addPanelElement("label", "lblRatio", "txtDiv7", "100 %", "menu__label");

    lblRuns.style.fontWeight = "bold";
    lblRuns.style.fontSize = "18px";
    lblMovingDrops.style.fontWeight = "bold";
    lblMovingDrops.style.fontSize = "18px";
    lblStaticDrops.style.fontWeight = "bold";
    lblStaticDrops.style.fontSize = "18px";
    lblRatio.style.fontWeight = "bold";
    lblRatio.style.fontSize = "42px";
    document.getElementById("startStop").disabled = true;
 
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvasStatic = document.getElementById("canvas_static");
    ctxStatic = canvasStatic.getContext("2d");

    lblDrops = document.getElementById("drop-number");
    lblCollected = document.getElementById("drop-collected");
    lblDropsStatic = document.getElementById("drop-number-static");
    lblCollectedStatic = document.getElementById("drop-collected-static");
    lblDropsStatic.style.top = (300+20).toString()+"px;";
    lblCollectedStatic.style.top = (300+60).toString()+"px;";
    
    drops=[];
    dropsStatic = [];
    createDropLayer(50, canvas.width, maxSpeed);
    var w = trailWidth;
    pan = new Pan(canvas.width - w, canvas.height - 1, w, 25, -1);
    panStatic = new Pan(canvasStatic.width - w, canvasStatic.height - 1, w, 0, -1);
});

function reSet(){
    isRunning = false;
    drops=[];
    dropsStatic=[];
    density = parseInt(document.getElementById("txtDensity").value);
    avg_speed = parseFloat(document.getElementById("txtSpeed").value);
    minSpeed = avg_speed - 0.5;
    maxSpeed = avg_speed + 0.5;
    dropGenerator=0;
    trailSpeed = parseFloat(trailSpeedEl.value);
    document.getElementById("startStop").textContent = "Start";
    document.getElementById("startStop").disabled = true;
    panHeight = parseFloat(panHeightEl.value);
    var w = trailWidth;
    lblMovingDrops.textContent = "0";
    lblStaticDrops.textContent = "0";
    lblRuns.textContent = "0";
    lblRatio.textContent = "100 %";
    loopCounter=0;
    collectedDrops=0;
    collectedDropsStatic=0;
    isCounting=false;
    document.getElementById("rerun").disabled = false;
    if(request_id)cancelAnimationFrame(request_id);
}

function reRun(){
    isRunning = true;
    drops=[];
    dropsStatic=[];
    density = parseInt(document.getElementById("txtDensity").value);
    avg_speed = parseFloat(document.getElementById("txtSpeed").value);
    minSpeed = avg_speed - 0.5;
    maxSpeed = avg_speed + 0.5;
    dropGenerator=0;
    trailSpeed = parseFloat(trailSpeedEl.value);
    createDropLayer(density, canvas.width);//this creates both drops and dropsStatic
    document.getElementById("startStop").textContent = "Stop";
    document.getElementById("startStop").disabled = false;
    panHeight = parseFloat(panHeightEl.value);
    var w = trailWidth;
    pan = new Pan((1.2+trailSpeed/10) * canvas.width - w, canvas.height - 2, w, panHeight, -trailSpeed);
    panStatic = new Pan(canvasStatic.width/2 - w/2, canvasStatic.height - 2, w, 2, 0);
    loopCounter=0;
    collectedDrops=0;
    collectedDropsStatic=0;
    isCounting=false;
    document.getElementById("rerun").disabled = true;
    if(request_id)cancelAnimationFrame(request_id);
    request_id = requestAnimationFrame(render);
}

function startStop(){
    if(isRunning){
        isRunning = false;
        document.getElementById("startStop").textContent = "Start";
        cancelAnimationFrame(request_id);
        document.getElementById("rerun").disabled = false;
    }else{
        isRunning = true;
        document.getElementById("startStop").textContent = "Stop";
        document.getElementById("rerun").disabled = true;
        request_id = requestAnimationFrame(render);
    }
}

function render(){
    //clear canvases
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxStatic.fillStyle = "#000000";
    ctxStatic.fillRect(0, 0, canvasStatic.width, canvasStatic.height);
    //update pan
    pan.update();
    if(pan.x < canvas.width - pan.width) isCounting = true;
    if(pan.x <= 0 ){
        isCounting = false;
        document.getElementById("rerun").disabled = false;
        var mov = parseInt(lblMovingDrops.textContent) + collectedDrops;
        var stat = parseInt(lblStaticDrops.textContent) + collectedDropsStatic;
        lblMovingDrops.textContent = (mov).toString();
        lblStaticDrops.textContent = (stat).toString();
        lblRuns.textContent = (parseInt(lblRuns.textContent)+1).toString();
        lblRatio.textContent = (100*mov/stat).toFixed(0) + " %";
        cancelAnimationFrame(request_id);
        reRun();
        return;
    }
    //draw drops
    ctx.fillStyle = "#eeeeffcc";
    var forDel = [];
    var forDelStatic = [];
    //loop through drops
    for(var d of drops){
        d.update();
        //check if drop is in pan and remove it
        if(d.xPos >= pan.x && d.xPos <= pan.x + pan.width && d.yPos >= pan.y - pan.height && d.yPos <= pan.y){
            if(isCounting){
                forDel.push(d);
                collectedDrops++;
            }
        }
        //check if drop is out of canvas and remove it
        if(d.yPos > canvas.height + 5)
            forDel.push(d);
        else
            d.draw(ctx);
    }
    //loop through static drops
    ctxStatic.fillStyle = "#eeeeffcc";
    for(var d of dropsStatic){
        d.update();
        //check if drop is in static pan and remove it
        if(d.xPos >= panStatic.x && d.xPos <= panStatic.x + panStatic.width && d.yPos >= panStatic.y-d.radius){//} - panStatic.height && d.yPos <= panStatic.y){
            if(isCounting){
                forDelStatic.push(d);
                collectedDropsStatic++;
            }
        }
        //check if drop is out of static canvas and remove it
        if(d.yPos > canvasStatic.height + 5)
            forDelStatic.push(d);
        else
            d.draw(ctxStatic);
    }
    //draw moving and static pans
    pan.draw(ctx, collectedDrops*density/(trailWidth*pan.height));
    ctxStatic.lineWidth = 4;
    ctxStatic.strokeStyle = "#ffff00";
    panStatic.draw(ctxStatic);
    //remove deleted drops
    drops = drops.filter(item => !forDel.includes(item));
    dropsStatic = dropsStatic.filter(item => !forDelStatic.includes(item));
    //set values to labels
    lblDrops.textContent = drops.length.toString();
    lblCollected.textContent = collectedDrops.toString();
    lblDropsStatic.textContent = dropsStatic.length.toString();
    lblCollectedStatic.textContent = collectedDropsStatic.toString();
    //update counter and every 10 loops generate a new dropLayer
    loopCounter++;
    if(loopCounter % 10 == 0){
        createDropLayer(density, canvas.width);
    }
    //request animation
    request_id = requestAnimationFrame(render);
}

function createDropLayer(num, wid){
    for(var i = 0 ; i < num ; i++){
        var x = wid * Math.random();
        var y = 0;//600 * Math.random();
        var vy = minSpeed + (maxSpeed-minSpeed) * Math.random();
        var d = new Drop(dropGenerator++, x, y, 1, 0, vy);
        drops.push(d);
        dropsStatic.push(d);
    }
}

/**
 * Creates a new element and appends it to the panel
 * @param {string} elType - the type of element. This can be also an input element in wchich case must be followed by input type
 * @param {string} elId - the id of the created element (it could be empty)
 * @param {string} elParent - the id of element's parent. If it is empty then the parent is directly the panel
 * @param {string} elContent - the content of the element (it could be empty)
 * @param {string} elClass - the list of element classes (classes' names are separated by space)
 * @returns {element} creates the element but also returns it
 */
function addPanelElement(elType, elId, elParent, elContent, elClass){
    var el;
    var elm = elType.split(" ");
    if(elm.length==1){
        el = document.createElement(elm[0]);
    }else{
        el = document.createElement(elm[0]);
        el.type = elm[1];
    }
    if(elId!="")el.id = elId;
    if(elContent!=""){
        if(el.type == "text")
            el.value = elContent;
        else
            el.textContent = elContent;
    }
    if(elClass!=""){
        var cl = elClass.split(" ");
        for(var i=0;i<cl.length;i++)
            el.classList.add(cl[i]);
    }
    if(elParent=="")
        document.getElementById("panelBox").appendChild(el);
    else 
        document.getElementById(elParent).appendChild(el);
    return el;
}

// function createStyles(side){
//     var st="";
//     /* css for SlidingPanel */
//     st += "#menu__toggle {";
//     st += "    opacity: 0;";
//     st += " }";
//     st += "#menu__toggle:checked + .menu__btn > span {";
//     if(side=="left")st += "    transform: translate(180px, 0px) rotate(45deg);";
//     else st += "    transform: rotate(45deg);";
//     st += " }";
//     st += "#menu__toggle:checked + .menu__btn > span::before {";
//     st += "    top: 0;";
//     st += "    transform: rotate(0deg);";
//     st += "}";
//     st += "#menu__toggle:checked + .menu__btn > span::after {";
//     st += "    top: 0;";
//     st += "    transform: rotate(90deg);";
//     st += "}";
//     st += "#menu__toggle:checked ~ .menu__box {";
//     if(side=="left")st += "    left: 0 !important;";
//     else st += "    right: 0 !important;";
//     st += "}";
//     st += ".menu__btn {";
//     st += "    position: fixed;";
//     st += "    top: 28px;";
//     if(side=="left")st += "    left: 20px;";
//     else st += "    right: 20px;";
//     st += "    width: 26px;";
//     st += "    height: 26px;";
//     st += "    cursor: pointer;";
//     st += "    z-index: 1;";
//     st += "}";
//     st += ".menu__btn > span,";
//     st += ".menu__btn > span::before,";
//     st += ".menu__btn > span::after {";
//     st += "    display: block;";
//     st += "    position: absolute;";
//     st += "    width: 100%;";
//     st += "    height: 6px;";
//     st += "    background-color: #bbbbbb;";/*#616161;*/
//     st += "    transition-duration: .35s;";
//     st += "}";
//     st += ".menu__btn > span::before {";
//     st += "    content: '';";
//     st += "    top: -8px;";
//     st += " }";
//     st += ".menu__btn > span::after {";
//     st += "    content: '';";
//     st += "    top: 8px;";
//     st += "}";
//     st += ".menu__box {";
//     st += "    display: block;";
//     st += "    position: fixed;";
//     st += "    top: 10px;";
//     if(side=="left")st += "    left: -100%;";
//     else st += "    right: -100%;";
//     st += "    width: 240px;";
//     st += "    height: 85%;";
//     st += "    margin: 0;";
//     st += "    padding: 40px 0;";
//     if(side=="left")st += "    border-radius: 0px 8px 8px 0px;";
//     else st += "    border-radius: 8px 0px 0px 8px;";
//     st += "    list-style: none;";
//     st += "    /*overflow-y:scroll;*/";
//     st += "    background-color: #fcc734ee;";//#333355cc;"
//     st += "    box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);";
//     st += "    transition-duration: .25s;";
//     st += "}";
//     st += ".menu__item {";
//     st += "    display: block;";
//     st += "    padding: 4px 4px;";
//     st += "    color: #fff;";
//     st += "    font-family: 'Roboto', sans-serif;";
//     st += "    font-size: 14px;";
//     st += "    font-weight: 100;";
//     st += "    text-decoration: none;";
//     st += "    transition-duration: .25s;";
//     st += "}";
//     st += ".menu__item:hover {";
//     st += "    background-color: #CFD8DC;";
//     st += "    color:black;";
//     st += "}";
//     /* end of css for SlidingPanel */
//     /* elements inside SlidingPanel */
//     st += ".menu__center{";
//     st += "    overflow: hidden;";
//     st += "    margin:4px auto;";
//     st += "    padding: 4px 4px;";
//     st += "}";
//     st += ".menu__center__center{";
//     st += "    padding: 8px;";
//     st += "    display: -webkit-box;";
//     st += "    display: -moz-box;";
//     st += "    display: -ms-flexbox;";
//     st += "    display: -webkit-flex;";
//     st += "    display: flex;";
//     st += "    -webkit-box-align : center;";
//     st += "    -moz-box-align: center;";
//     st += "    -ms-flex-align: center;";
//     st += "    -webkit-align-items: center;";
//     st += "    align-items: center;";
//     st += "    justify-content: center;";
//     st += "    -webkit-justify-content: center;";
//     st += "    -webkit-box-pack: center;";
//     st += "    -moz-box-pack: center;";
//     st += "    -ms-flex-pack: center;";
//     st += "}";
//     st += ".menu__title{";
//     st += "    font-size:18px;";
//     st += "    font-weight: bold;";
//     st += "    background-color: #9898aC;";
//     st += "    color:black;";
//     st += "    float:center;";
//     st += "}";
//     st += ".menu__unhover:hover{";
//     st += "    background-color: transparent;";
//     st += "    color:white;";
//     st += "}";
//     st += ".menu__button{";
//     st += "     font-size:14px;";
//     st += "     font-weight:bold;";
//     st += "     border-radius: 6px;";
//     st += "     background-color: #333377;";
//     st += "     color:white;";
//     st += "     margin:auto;";
//     st += "     padding:8px;";
//     st += "}";
//     st += ".menu__button:hover{";
//     st += "     background-color: #ccccff;";
//     st += "     color:black;";
//     st += "}";
//     st += ".menu__button:disabled,";
//     st += ".menu__button[disabled]{";
//     st += "     border: 1px solid #999999;";
//     st += "     background-color: #cccccc;";
//     st += "     color: #666666;";
//     st += "}";
//     st += "input[type='text']{";
//     st += "     max-width:40%;";
//     st += "     margin:4px;";
//     st += "}";
//     st += ".menu__label{";
//     st += "     max-width:80%;";
//     st += "     float: left;";
//     st += "     padding: 4px 4px;";
//     st += "}";
//     st += ".menu__text{";
//     st += "     max-width:40%;";
//     st += "     float: right;";
//     st += "     padding: 0px 4px;";
//     st += "}";
//     st += ".menu__block{";
//     st += "     display:block;";
//     st += "}";
//     /* end of elements inside SlidingPanel */

//     var styleCss = document.createElement("style");
//     styleCss.textContent = st;
//     document.head.appendChild(styleCss);
//     return styleCss;
// }
