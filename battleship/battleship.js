const MAXSHOTS = 5;
var playerCanvas;
var enemyCanvas;
var ctxPL;//context of player
var ctxEN;//context of enemy
var designPanel;
var playPanel;
var btnNewGame;
var btnSetupGame;
var btnQuitGame;
var btnRotate;

var cols;
var rows;
var boardWidth = 420;
var tileSize = 35;
var player = [];
var enemy = [];
var pointingTile;
var setupTile;
var imgCounter=0;
var isPlaying = 0;
var shipPartsCounter;

//animation and image stuff
var requestID; //for play loop
var requestSetID;//for setup loop
var zero;
let particles = [];
var drops = [];
var imgCarrier = ["50.png","51.png","52.png","53.png","54.png"];
var imgCarrierLR = ["50LR.png","51LR.png","52LR.png","53LR.png","54LR.png"];
var imgDestroyer = ["50.png","51.png","53.png","54.png"];
var imgDestroyerLR = ["50LR.png","51LR.png","53LR.png","54LR.png"];
var imgMiner = ["50.png","51.png","54.png"];
var imgMinerLR = ["50LR.png","51LR.png","54LR.png"];
var imgSubmarine =  ["50.png","54.png"];
var imgSubmarineLR =  ["50LR.png","54LR.png"];
var carrierImage = [];
var carrierLRImage = [];
var destroyerImage = [];
var destroyerLRImage = [];
var minerImage = [];
var minerLRImage = [];
var submarineImage = [];
var submarineLRImage = [];
var carrierImageGray = [];
var carrierLRImageGray = [];
var destroyerImageGray = [];
var destroyerLRImageGray = [];
var minerImageGray = [];
var minerLRImageGray = [];
var submarineImageGray = [];
var submarineLRImageGray = [];
var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numOfCarriers = 1;
var numOfDestroyers = 2;
var numOfMiners = 3;
var numOfSubmarines = 4;
var enemyDelay = 50;
var setupCarriers=0;
var setupDestroyers = 0;
var setupMiners = 0;
var setupSubmarines = 0;
//for checking if carrier was destroyed
var playerCarrier = [];
var enemyCarrier = [];
var playerCarrierHits;
var enemyCarrierHits;
var playerShots;
var enemyShots;
var playerMaxShots;
var enemyMaxShots;
var timeCounter=0;
var playerScore = 0;
var enemyScore = 0;
var mouseOver = false;
var isSettingGame = false;
var candidate = [];
var enShots = [];
//audio
var boomAudio = new Audio('./img/explosion.mp3');
var bloomAudio = new Audio('./img/splash.mp3');

window.onload = function() {
    playerCanvas=document.createElement("canvas");
    playerCanvas.width=boardWidth;
    playerCanvas.height=boardWidth;
    document.getElementById("player").appendChild(playerCanvas);
    enemyCanvas=document.createElement("canvas");
    enemyCanvas.width=boardWidth;
    enemyCanvas.height=boardWidth;
    document.getElementById("enemy").appendChild(enemyCanvas);
    ctxPL = playerCanvas.getContext("2d");
    ctxEN = enemyCanvas.getContext("2d");
    ctxPL.scale(1,1);
    designPanel = document.getElementsByClassName("design")[0];
    playPanel = document.getElementsByClassName("play")[0];
    cols = boardWidth/tileSize;
    rows = boardWidth/tileSize;
    designPanel.style.display = "none";
    playPanel.style.display = "block";
    loadImages();
    loadGrayImages();
    setBoard("player");
    setBoard("enemy");
    btnNewGame = document.getElementById("newGame");
    btnNewGame.addEventListener("click", startNewGame);
    btnSetupGame = document.getElementById("setupGame");
    btnSetupGame.addEventListener("click", setupGame);
    btnQuitGame = document.getElementById("quitGame");
    btnQuitGame.addEventListener("click", quitGame);
    enemyCanvas.addEventListener("mousemove", enemyMouseMove);
    enemyCanvas.addEventListener("mouseleave", enemyMouseLeave);
    enemyCanvas.addEventListener("mousedown", enemyMouseClick);
    playerCanvas.addEventListener("mousemove", playerMouseMove);
    playerCanvas.addEventListener("mouseleave", playerMouseLeave);
    playerCanvas.addEventListener("mousedown", playerMouseClick);
    btnRotate = document.getElementById("setShip");
    btnRotate.addEventListener("click", playerRotate);
    console.log("Cheet: Ctrl+Shft+Alt+u");
}

function showHint(event){
    if(event.key == "U" && event.altKey == true && event.shiftKey == true && event.ctrlKey==true){
        Swal.fire({
            title:"Enemy:",
            html:printBoard("enemy"),
            width: "800px;",
        });
    }
}


function setBoard(what){
    if(what == "player")player = [];
    else enemy = [];
    if(what == "player"){
        for(var r=0;r<rows;r++){
            var rowTiles = [];
            for(var c=0;c<cols;c++){
                var tile = new Tile("p"+letter[r]+letter[c], r, c, tileSize);
                rowTiles.push(tile);
            }
            player.push(rowTiles);
        }
    } else {
        for(var r=0;r<rows;r++){
            var rowTiles = [];
            for(var c=0;c<cols;c++){
                var tile = new Tile("e"+letter[r]+letter[c], r, c, tileSize);
                tile.visible = false;
                rowTiles.push(tile);
            }
            enemy.push(rowTiles);
        }
    }
    for(var r=0;r<rows;r++){
        for(var c=0;c<cols;c++){
            if(what == "player")player[r][c].draw(ctxPL);
            else enemy[r][c].draw(ctxEN);
        }
    }
    pointingTile = new Tile("pointer",0,0,tileSize);
}

/** the main game loop where everything happens */
function gameLoop(timeStamp){
    ctxEN.clearRect(0, 0, boardWidth, boardWidth);
    ctxPL.clearRect(0, 0, boardWidth, boardWidth);
    //draw all ships
    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){
            player[r][c].draw(ctxPL);
            enemy[r][c].draw(ctxEN);
        }
    }
    //draw player's pointer
    if(mouseOver && isPlaying == 1)
        pointingTile.draw(ctxEN);
    //if enemy is shooting delay accordingly
    if(isPlaying == -1){
        timeCounter++;
        if(timeCounter % enemyDelay == 0){
            enemyShoot();
            timeCounter=0;
        }
    }
    //check for winner
    if(playerScore >= shipPartsCounter && enemyScore < shipPartsCounter){
        //player is the winner
        setFinale("player");
        return;
    }else if(enemyScore >= shipPartsCounter && playerScore < shipPartsCounter){
        //enemy is the winner
        setFinale("enemy");
        return;
    }else if(enemyScore >= shipPartsCounter && playerScore >= shipPartsCounter){
        //how we come here?
        alert("It's a Draw?");
        isPlaying = 0;
        cancelAnimationFrame(requestID);
        return;
    }
    //timer of the game
    if(zero === undefined){
        zero = timeStamp;
    }
    const elapsed = timeStamp - zero;
    document.getElementById("time").textContent = getTimeString(elapsed);
    requestID = requestAnimationFrame(gameLoop);
}

function startNewGame(){
    designPanel.style.display = "none";
    playPanel.style.display = "block";
    isSettingGame = false;
    setBoard("player");
    setBoard("enemy");
    var dir;
    var r;
    var c;
    shipPartsCounter = 0;
    //setup player randomly
    for(var i=0;i<numOfCarriers;i++){
        [dir, r, c] = findShipPosition("carrier");
        setPlayerShip("carrier", r, c, dir);
    }
    for(var i=0;i<numOfDestroyers;i++){
        [dir, r, c] = findShipPosition("destroyer");
        setPlayerShip("destroyer", r, c, dir);
    }
    for(var i=0;i<numOfMiners;i++){
        [dir, r, c] = findShipPosition("miner");
        setPlayerShip("miner", r, c, dir);
    }
    for(var i=0;i<numOfSubmarines;i++){
        [dir, r, c] = findShipPosition("submarine");
        setPlayerShip("submarine", r, c, dir);
    }
    //setup enemy randomly
    for(var i=0;i<numOfCarriers;i++){
        [dir, r, c] = findEnemyPosition("carrier");
        setEnemyShip("carrier", r, c, dir);
    }
    for(var i=0;i<numOfDestroyers;i++){
        [dir, r, c] = findEnemyPosition("destroyer");
        setEnemyShip("destroyer", r, c, dir);
    }
    for(var i=0;i<numOfMiners;i++){
        [dir, r, c] = findEnemyPosition("miner");
        setEnemyShip("miner", r, c, dir);
    }
    for(var i=0;i<numOfSubmarines;i++){
        [dir, r, c] = findEnemyPosition("submarine");
        setEnemyShip("submarine", r, c, dir);
    }

    //console.log(printBoard("player"));
    //console.log(printBoard("enemy"));
    candidate = [];
    enShots = [];
    enemyMaxShots=MAXSHOTS;
    playerMaxShots=MAXSHOTS;
    playerShots = playerMaxShots;
    enemyShots = enemyMaxShots;
    playerCarrierHits = 0;
    enemyCarrierHits = 0;
    btnNewGame.disabled=true;
    btnSetupGame.disabled=true;
    btnQuitGame.disabled=false;
    playerScore = 0;
    enemyScore = 0;
    isPlaying = 1;//player starts
    setPlayer();
    setRoundHits();
    zero = undefined;
    requestID = requestAnimationFrame(gameLoop);
}

function setupGame(){
    designPanel.style.display = "block";
    playPanel.style.display = "none";
    isSettingGame = true;
    btnNewGame.disabled=true;
    btnSetupGame.disabled=true;
    btnQuitGame.disabled=true;
    shipPartsCounter = 0;
    setBoard("enemy");
    //setup enemy randomly
    for(var i=0;i<numOfCarriers;i++){
        [dir, r, c] = findEnemyPosition("carrier");
        setEnemyShip("carrier", r, c, dir);
    }
    for(var i=0;i<numOfDestroyers;i++){
        [dir, r, c] = findEnemyPosition("destroyer");
        setEnemyShip("destroyer", r, c, dir);
    }
    for(var i=0;i<numOfMiners;i++){
        [dir, r, c] = findEnemyPosition("miner");
        setEnemyShip("miner", r, c, dir);
    }
    for(var i=0;i<numOfSubmarines;i++){
        [dir, r, c] = findEnemyPosition("submarine");
        setEnemyShip("submarine", r, c, dir);
    }
    ctxEN.clearRect(0, 0, boardWidth, boardWidth);
    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){
            enemy[r][c].draw(ctxEN);
        }
    }
    enShots = [];
    //console.log(printBoard("enemy", true));
    setBoard("player");
    setupType = 5;
    colorSetupType(setupType);
    setupDir = "vertical";
    setupCarriers=0;
    setupDestroyers = 0;
    setupMiners = 0;
    setupSubmarines = 0;
    //set initial values to labels
    document.getElementById("submarines-left").children[0].textContent = setupSubmarines + " / " + numOfSubmarines;
    document.getElementById("miners-left").children[0].textContent = setupMiners + " / " + numOfMiners;
    document.getElementById("destroyers-left").children[0].textContent = setupDestroyers + " / " + numOfDestroyers;
    document.getElementById("carriers-left").children[0].textContent = setupCarriers + " / " + numOfCarriers;
    setupTile = new Ship(setupType, 0, 0, setupDir);
    zero = undefined;
    requestID = requestAnimationFrame(setupLoop);
}

function quitGame(){
    btnNewGame.disabled=false;
    btnSetupGame.disabled=false;
    btnQuitGame.disabled=true;
    cancelAnimationFrame(requestID);
}

function getTimeString(t){
    var ti = Math.floor(t/1000);
    var h = Math.floor(ti/3600);
    var m = Math.floor((ti - h*3600)/60);
    var s = ti-h*3600-m*60;
    return h.toString()+":"+(m > 9 ? m.toString() : "0" + m.toString()) + ":" + (s > 9 ? s.toString() : "0" + s.toString());
}

function enemyMouseMove(e){
    var r = Math.floor(e.offsetY/tileSize);
    var c = Math.floor(e.offsetX/tileSize);
    pointingTile.row = r;
    pointingTile.col = c;
    mouseOver = true;
}

function enemyMouseLeave(e){
    mouseOver = false;
}

function enemyMouseClick(e){
    if(isPlaying != 1)return;
    playerShots--;
    setRoundHits();
    var r = Math.floor(e.offsetY/tileSize);
    var c = Math.floor(e.offsetX/tileSize);
    if(enemy[r][c].value < 0) return;//it is already hit
    pointingTile.row = r;
    pointingTile.col = c;
    if(enemy[r][c].value > 0){
        boom(ctxEN, c * tileSize + tileSize/2, r * tileSize + tileSize/2);
        //boomAudio.pause();
        boomAudio.play();
        enemy[r][c].visible=true;
        enemy[r][c].value=-2;
        playerScore++;
        setHits();
        if(isCarrier(r, c, enemyCarrier)){
            enemyCarrierHits++;
            if(enemyCarrierHits == 5)enemyMaxShots = 3;
        }
    }else{
        bloom(ctxEN, c * tileSize + tileSize/2, r * tileSize + tileSize/2);
        //bloomAudio.pause();
        bloomAudio.play();
        enemy[r][c].value=-1;
    }
    if(playerShots == 0){
        isPlaying = -1;
        enemyShots = enemyMaxShots;
        setPlayer();
        setRoundHits();
    }
}

function enemyShoot(){
    enemyShots--;
    setRoundHits();
    var byCandidate = "";
    var r = Math.floor(Math.random()*rows);
    var c = Math.floor(Math.random()*cols);
    if(candidate.length==0){
        while(player[r][c].value < 0){
            r = Math.floor(Math.random()*rows);
            c = Math.floor(Math.random()*cols);
        }
    }else{
        var i=0;
        r = candidate[i][0];
        c = candidate[i][1];
        for(var i = 0; i < candidate.length; i++){
            if(player[candidate[i][0]][candidate[i][1]].value >= 0){
                r = candidate[i][0];
                c = candidate[i][1];
                if(i < candidate.length){
                    byCandidate = candidate[i][2];
                    candidate.splice(i,1);
                }
                break;
            }
        }
        //console.log("by candidate "+candidate);
    }
    //check if this shot is already fired, in which case select another shot
    if(enShots.includes([r,c])){
        candidate = [];
        var r = Math.floor(Math.random()*rows);
        var c = Math.floor(Math.random()*cols);
        while(player[r][c].value < 0){
            r = Math.floor(Math.random()*rows);
            c = Math.floor(Math.random()*cols);
        }
        //console.log("Candidates removed");
    }
    if(player[r][c].value > 0){
        if(byCandidate != ""){
            for(var i=candidate.length-1;i>=0;i--){
                if(candidate[i][2] != byCandidate){
                    candidate.splice(i,1);
                }
            };
        }
        boom(ctxPL, c * tileSize + tileSize/2, r * tileSize + tileSize/2);
        //boomAudio.pause();
        boomAudio.play();
        player[r][c].visible=true;
        player[r][c].value=-2;
        candidate = candidate.concat(getCandidates(r,c));
        enemyScore++;
        setHits();
        var img = grayShipImage(player[r][c].img)
        player[r][c].img = img === undefined ? null : img;
        if(isCarrier(r, c, playerCarrier)){
            playerCarrierHits++;
            if(playerCarrierHits == 5)playerMaxShots=3;
        }
    }else{
        bloom(ctxPL, c * tileSize + tileSize/2, r * tileSize + tileSize/2);
        //bloomAudio.pause();
        bloomAudio.play();
        player[r][c].value=-1;
    }
    enShots.push([r,c]);//keep the shot in the array to not fire it again
    if(enemyShots == 0){
        isPlaying = 1;
        playerShots = playerMaxShots;
        setPlayer();
        setRoundHits();
    }
}

function findShipPosition(type){
    var dir = Math.random() > 0.5 ? "horizontal" : "vertical";
    var shipLen = type == "carrier" ? imgCarrier.length : type == "destroyer" ? imgDestroyer.length : type == "miner" ? imgMiner.length : imgSubmarine.length;
    var startCol = 0;
    var endCol = cols-1;
    var startRow = 0;
    var endRow = rows-1;
    if(dir == "horizontal")endCol -= shipLen;
    else endRow -= shipLen;
    var found = false;
    while(!found){
        var posRow = Math.floor(Math.random()*(endRow));
        var posCol = Math.floor(Math.random()*(endCol));
        while(player[posRow][posCol].value!=0){
            posRow = Math.floor(Math.random()*(endRow));
            posCol = Math.floor(Math.random()*(endCol));
        }
        if(dir == "horizontal"){
            for(var i=0;i<shipLen;i++){
                if(player[posRow][posCol+i].value == 0)found=true;
                else {found=false; break;}
            }
        }else{
            for(var i=0;i<shipLen;i++){
                if(player[posRow+i][posCol].value == 0)found=true;
                else {found=false; break;}
            }
        }
    }
    return [dir, posRow, posCol];
}

function findEnemyPosition(type){
    var dir = Math.random() > 0.5 ? "horizontal" : "vertical";
    var shipLen = type == "carrier" ? imgCarrier.length : type == "destroyer" ? imgDestroyer.length : type == "miner" ? imgMiner.length : imgSubmarine.length;
    var startCol = 0;
    var endCol = cols-1;
    var startRow = 0;
    var endRow = rows-1;
    if(dir == "horizontal")endCol -= shipLen;
    else endRow -= shipLen+1;
    var found = false;
    while(!found){
        var posRow = Math.floor(Math.random()*(endRow));
        var posCol = Math.floor(Math.random()*(endCol));
        while(enemy[posRow][posCol].value!=0){
            posRow = Math.floor(Math.random()*(endRow));
            posCol = Math.floor(Math.random()*(endCol));
        }
        if(dir == "horizontal"){
            for(var i=0;i<shipLen;i++){
                if(enemy[posRow][posCol+i].value == 0)found=true;
                else {found=false; break;}
            }
        }else{
            for(var i=0;i<shipLen;i++){
                if(enemy[posRow+i][posCol].value == 0)found=true;
                else {found=false; break;}
            }
        }
    }
    return [dir, posRow, posCol];
}

/** Creates a explosion effect having its center at the point (in pixels) specified */
function boom(context, x, y){
    //explode the ship
    setTimeout(() => {
        particles = [];
        for (i = 0; i <= 150; i++) {
            let dx = (Math.random() - 0.5) * (Math.random() * 2);
            let dy = (Math.random() - 0.5) * (Math.random() * 2);
            let radius = Math.random() * 3;
            let particle = new Particle(context, x, y, radius, dx, dy);
            /* Adds new items like particle*/
            particles.push(particle); 
        }
        explode();
    }, 0);
}

/** Particle explosion function */
function explode() {
    particles.forEach((particle, i) => {
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else particles[i].update();
    });
    /* Performs a animation after request*/
    if(particles.length>0)
        requestAnimationFrame(explode);
}

/** Creates a missed effect having its center at the point (in pixels) specified*/
function bloom(context, x, y){
    //explode the ship
    setTimeout(() => {
        drops = [];
        for (i = 0; i <= 50; i++) {
            let dx = (Math.random() - 0.5) * (Math.random() * 1);
            let dy = (Math.random() - 0.5) * (Math.random() * 1);
            let radius = Math.random() * 3;
            let drop = new Drop(context, x, y, radius, dx, dy);
            /* Adds new items like particle*/
            drops.push(drop); 
        }
        bloomon();
    }, 0);
}

/** Particle explosion function */
function bloomon() {
    drops.forEach((drop, i) => {
        if (drops[i].alpha <= 0) {
            drops.splice(i, 1);
        } else drops[i].update();
    });
    /* Performs a animation after request*/
    if(drops.length>0)
        requestAnimationFrame(bloomon);
}
