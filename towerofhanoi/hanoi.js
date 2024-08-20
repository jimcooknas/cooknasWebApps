"use strict";
var myTimer = null;
var moveInfo;
var moveInc = 1;
var speed = 1;
var diskCount = 5;
var fromBar;
var toBar;
var fromId;
var toId;
var solveType = "manual";//"manual", "auto"
var isPlaying = false;
var speedSelectList, diskSelectList;
var moveCount = 0;

var callStack;

var barsInfo = [{}, {}, {}, {}, {}];

var diskPosTop, diskPosLeft, DiskID;

window.onload = function () {   
    diskPosTop = new Array();
    diskPosLeft = new Array();
    speedSelectList = document.getElementById("speedSelectList");
    diskSelectList = document.getElementById("diskSelectList");
    diskSelectList.addEventListener("change", function(){
        resetHanoi();
    });
   
    DiskID = [disk0, disk1, disk2, disk3, disk4];
    for (var i = 0; i < 5; i++){  
        diskPosTop[i] = DiskID[i].style.top; 
        diskPosLeft[i] = DiskID[i].style.left; 
    } 
    for(var i=0; i<3; i++)
        document.getElementById("bar"+i).addEventListener("click", selectBar);
} 

function setForManual(){ 
    isPlaying=true;
    diskCount = parseInt(diskSelectList.options[diskSelectList.selectedIndex].value);
    // Move Disks to start column  
    for (var i = 0; i < 5; i++){  
        DiskID[i].style.top = diskPosTop[i];
        DiskID[i].style.left= diskPosLeft[i];
    } 
    barsInfo[0].disks = ['disk0', 'disk1', 'disk2', 'disk3', 'disk4'];
    barsInfo[1].disks = [];
    barsInfo[2].disks = [];
    barsInfo[3].disks = [];
    barsInfo[4].disks = [];
    disk0.style.display = "block";
    disk1.style.display = "block";
    disk2.style.display = "block";
    disk3.style.display = "block";
    disk4.style.display = "block";
    switch (diskCount) {
        case 3: barsInfo[0].disks.pop(); barsInfo[0].disks.pop();
            disk3.style.display = "none"; disk4.style.display = "none"; break;

        case 4: barsInfo[0].disks.pop();
            disk4.style.display = "none"; break;
    }
    callStack = []; 
}

function selectBar(e){
    var fromTo;
    solveType = "manual";
    if(fromId == undefined){
        fromTo  = "from";
        fromId = parseInt(e.target.id.replace("bar",""));
        setBorder(e.target, fromTo, true);
    }else if (toId == undefined && fromId!=parseInt(e.target.id.replace("bar",""))){
        fromTo  = "to";
        toId =parseInt(e.target.id.replace("bar",""));
        setBorder(e.target, fromTo, true);
        if(!isPlaying) setForManual();
        callStack.push([fromId, toId]);
        moveDisk();
    }else{
        if(fromId!=undefined)setBorder(document.getElementById("bar"+fromId), "", false);
        if(toId!=undefined)setBorder(document.getElementById("bar"+toId), "", false);
        fromId = undefined;
        toId = undefined;
    }
}

function setBorder(el, fromTo, enable){
    var color = fromTo == "from" ? "rgba(220, 50, 50, 0.5)" : "rgba(50, 220, 50, 0.5)";
    if(enable){
        el.style.border = "4px solid " + color;
        el.style.borderBottom = "0";
    }else{
        el.style.border = "0px solid black";
    }
}

function executeHanoi() {
    solveType = "auto";
    speed = parseInt(speedSelectList.options[speedSelectList.selectedIndex].value);
    diskCount = parseInt(diskSelectList.options[diskSelectList.selectedIndex].value);
    console.log(speed+" "+diskCount+" ");
    // alert(diskCount);
    // var diskCount =3;

    // Move Disks to start column  
    for (var i = 0; i < 5; i++){  
        DiskID[i].style.top = diskPosTop[i];
        DiskID[i].style.left= diskPosLeft[i];
    } 

    barsInfo[0].disks = ['disk0', 'disk1', 'disk2', 'disk3', 'disk4'];
    //alert(barsInfo[0].disks.pop().id);
    barsInfo[1].disks = [];
    barsInfo[2].disks = [];
    barsInfo[3].disks = [];
    barsInfo[4].disks = [];

    switch (diskCount) {
        case 3: barsInfo[0].disks.pop(); barsInfo[0].disks.pop();
            disk3.style.display = "none"; disk4.style.display = "none"; break;

        case 4: barsInfo[0].disks.pop();
            disk4.style.display = "none"; break;
    }

    callStack = [];  // callStack array is global

    Hanoi(diskCount, 0, 2, 1);

    moveDisk(); // moveDisk takes its parameters from callStack
}


function Hanoi(n, from, to, via) {
    if (n == 0) return;

    Hanoi(n - 1, from, via, to);
    // moveDisk(from,to);

    callStack.push([from, to]); // save parameters to callStack array
    Hanoi(n - 1, via, to, from);

}


function moveDisk() {
    if (callStack.length == 0) return;
    var param = callStack.shift();  // Get call parameters from callStack
    // Note: throughout the code, I use fromBar, toBar to refer to towers
    fromBar = param[0];
    toBar = param[1];

    if(!isLegal(barsInfo[fromBar].disks[barsInfo[fromBar].disks.length-1],barsInfo[toBar].disks[barsInfo[toBar].disks.length-1])){
        if(fromId!=undefined)setBorder(document.getElementById("bar"+fromId), "", false);
        if(toId!=undefined)setBorder(document.getElementById("bar"+toId), "", false);
        fromId = undefined;
        toId = undefined;
        return;
    }
    var elem = document.getElementById(barsInfo[fromBar].disks.pop());  // find top elemnet in fromBar
    moveInfo = { elem: elem,
        fromBar: fromBar,
        toBar: toBar,
        whichPos: "top", // element position property for movement
        dir: -1,  // 1 or -1
        state: "up", // move upward
        endPos: 60    // end position (in pixels) for move upward
    }
    moveCount++;
    setMoveCount();
    myTimer = setInterval(animateMove, speed); // Start animation
}

function animateMove() {
    var elem = moveInfo.elem;
    var dir = moveInfo.dir;

    var pos = parseInt(elem[(moveInfo.whichPos == "left") ? "offsetLeft" : "offsetTop"]);

    if (((dir == 1) && (pos >= moveInfo.endPos)) || ((dir == -1) && (pos <= moveInfo.endPos))) {  // alert(moveInfo.state); 
        
        if (moveInfo.state == "up") {
            moveInfo.state = "hor";
            moveInfo.whichPos = "left";
            moveInfo.dir = 1;
            if (moveInfo.fromBar > moveInfo.toBar) moveInfo.dir = -1;
            //alert("toBar:" + moveInfo.toBar);
            var toBar = document.getElementById("bar" + moveInfo.toBar);
            // Next line: 15px is half of tower width    
            moveInfo.endPos = toBar.offsetLeft - Math.floor(elem.offsetWidth / 2) + 15;
            return;
        } else if (moveInfo.state == "hor"){ // move down
            moveInfo.state = "down";
            moveInfo.whichPos = "top";
            moveInfo.dir = 1;
            //alert(elem.offsetHeight);
            moveInfo.endPos = document.getElementById("bottombar").offsetTop - (barsInfo[moveInfo.toBar].disks.length + 1) * elem.offsetHeight;
            return;
        } else {// end of current call to moveDisk, issue next call
            clearInterval(myTimer);  // cancel timer 
            //clear borders from selected bars
            if(fromId!=undefined)setBorder(document.getElementById("bar"+fromId), "", false);
            if(toId!=undefined)setBorder(document.getElementById("bar"+toId), "", false);
            fromId = undefined;
            toId = undefined;
            //end of clear borders from selected bars
            barsInfo[moveInfo.toBar].disks.push(elem.id);
            moveDisk();
            return;
        }
    }


    // Move Disk
    pos = pos + dir * moveInc;
    elem.style[moveInfo.whichPos] = pos + "px";

    // Move the inside middle image
    // if (moveInfo.state == "up") {
    //     var fromBar = document.getElementById("bar" + moveInfo.fromBar);
    //     if (elem.offsetTop < fromBar.offsetTop) {
    //         var x = elem.getElementsByClassName("insideImg")[0].offsetHeight;
    //         if (x > 0) elem.getElementsByClassName("insideImg")[0].style.height = x - moveInc + "px";
    //     }
    // }

    // if (moveInfo.state == "down") {
    //     var toBar = document.getElementById("bar" + moveInfo.toBar);
    //     if (elem.offsetTop > toBar.offsetTop) {
    //         var x = elem.getElementsByClassName("insideImg")[0].offsetHeight;
    //         if (x < 14) elem.getElementsByClassName("insideImg")[0].style.height = x + moveInc + "px";
    //     }
    // }

}

function isLegal(fromName, toName){
    console.log(fromName + " - " + toName);
    if(fromName == undefined)return false;
    if(toName==undefined)return true;
    var fro = parseInt(fromName.replace("disk",""));
    var to = parseInt(toName.replace("disk",""));
    if(fro > to)return true;
    else return false;
}

function resetHanoi(){
    if(myTimer!=undefined)clearInterval(myTimer);
    diskCount = parseInt(diskSelectList.options[diskSelectList.selectedIndex].value);
    // Move Disks to start column  
    for (var i = 0; i < 5; i++){  
        DiskID[i].style.top = diskPosTop[i];
        DiskID[i].style.left= diskPosLeft[i];
    } 

    barsInfo[0].disks = ['disk0', 'disk1', 'disk2', 'disk3', 'disk4'];
    barsInfo[1].disks = [];
    barsInfo[2].disks = [];
    barsInfo[3].disks = [];
    barsInfo[4].disks = [];
    disk0.style.display = "block";
    disk1.style.display = "block";
    disk2.style.display = "block";
    disk3.style.display = "block";
    disk4.style.display = "block";
    switch (diskCount) {
        case 3: barsInfo[0].disks.pop(); barsInfo[0].disks.pop();
            disk3.style.display = "none"; disk4.style.display = "none"; break;

        case 4: barsInfo[0].disks.pop();
            disk4.style.display = "none"; break;
    }
    callStack = []; 
    moveCount = 0;
    setMoveCount();
}

function setMoveCount(){
    document.getElementById("moveCount").innerHTML = "<b>"+moveCount+"</b>";
}