//based on Kenny Yip's code https://github.com/ImKennyYip/space-invaders

var highScore = [['Cooknas',  10000], ['Jim-Jim',  9000],['Mitsos',  8000],['Mitsaras', 7000],['Cooknas5', 6000],
                  ['Cooknas6', 5000], ['Cooknas7', 4000],['Cooknas8', 3000],['Cooknas9', 2000],['Cooknas10',  1000]];

var scoreTable;
//animation loop 
var requestId;
//board
let tileSize = 32;//32
let rows = 18; 
let columns = 24;     

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;
let loopCounter = 0;

//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize; //ship moving speed

//aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg = [];
let bonusImg;
let bonus;
let bonusAppears = 1;

let alienRows = 2;
let alienColumns = 6;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1; //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed
let alienBulletArray = [];
let alienBulletVelocityY = 8; //bullet moving speed

let score = 0;
let gameOver = false;
let particles = [];
let waitNow = false;

let lives = 3;
let playPending = false; 
let level = 1;

var btnStart;

window.onload = function() {
    scoreTable = document.getElementById("scoreTable");
    btnStart = document.getElementById("startNewGame");
    btnStart.style.display = "flex";
    scoreTable.style.display = "block";
    getOutput();
    //setScoreTable();
    
    //set the board to canvas and get the 2D context
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial ship after loading image
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    //create aliens' variables and load images
    alienImg = [];
    for(let i=0; i<3 ;i++){
        var alImg1 = new Image();
        alImg1.src = "./alien"+(i+1)+"1.png";
        var alImg2 = new Image();
        alImg2.src = "./alien"+(i+1)+"2.png";
        alienImg.push([alImg1, alImg2]);
    }
    bonusImg = new Image();
    bonusImg.src = "./bonus.png";
    //crate a set of aliens for the begining
    //createAliens();
    //start the loop requesting AnimationFrame
    //requestId = requestAnimationFrame(update);
    
    
    
    //set the listeners for moveship (keydown) and shoot (keyup)
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    // if (gameOver) {
    //     return;
    // }

    if(playPending) {
        context.fillStyle="white";
        context.font="38px courier";
        let si1 = context.measureText("Press any key to continue");
        //console.log(si1);
        context.fillText("Press any key to continue", boardWidth/2-si1.width/2, boardHeight/2 + 40);
        requestId = requestAnimationFrame(update);
        return;
    }
    //clear canvas
    context.clearRect(0, 0, board.width, board.height);
    //draw ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    if(isTimeForBonus()){
        bonus = {
            img : bonusImg,
            x : boardWidth - tileSize,
            y : tileSize,
            width : alienWidth,
            height : alienHeight,
            bonusVelocity: -2,
            alive : true,
            score: 1000,
        }
        bonusAppears--;
    }
    if(bonus!=undefined && bonus.alive){
        context.drawImage(bonusImg, bonus.x, bonus.y, bonus.width, bonus.height);
        bonus.x += bonus.bonusVelocity;
        if(bonus.x<=0){
            bonus.x=0;
            bonus.bonusVelocity *= -1;
        }
        if(bonus.x >= boardWidth){
            bonus.alive = false;
            bonus = undefined;
        }
    }

    //alien
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;
            //if alien touches the borders
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;
                //move all aliens up by one row
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            if(loopCounter % 20  == 0)alien.imgPos = alien.imgPos==0?1:0;
            context.drawImage(alienImg[alien.imgType][alien.imgPos], alien.x, alien.y, alien.width, alien.height);
            if (alien.y >= ship.y) {
                lives--;
                if(lives<0)lives=0;
                alienArray = [];
                bonus = undefined;
                bulletArray = [];
                alienBulletArray = [];
                if(lives==0){
                    gameOver = true;
                    waitNow=true;
                    cancelAnimationFrame(requestId);
                    context.fillStyle="yellow";
                    context.font="normal 800 52px courier";
                    let si1 = context.measureText("Game Over");
                    context.fillText("Game Over", boardWidth / 2 - si1.width / 2, boardHeight / 2 - 21);
                    setTimeout(() => {
                        notWaitNow();
                    },4000);
                }else{
                    createAliens();
                    playPending=true;
                } 
            }
            //alien fires bullets
            if(Math.random() < 0.002 && alien.imgType == 2){
                let bullet = {
                    x : alien.x + alien.width * 15 / 32,
                    y : alien.y,
                    width : tileSize / 8,
                    height : tileSize / 4,
                    used : false
                }
                alienBulletArray.push(bullet);
            }
        }    
    }
    //bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="yellow";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        //bullet collisin with bonus
        if(bonus!=undefined){
            if(bonus.alive && detectCollision(bullet, bonus)){
                var thisx = bonus.x;
                var thisy = bonus.y;
                setTimeout(() => {
                    particles = [];
                    for (i = 0; i <= 150; i++) {
                        let dx = (Math.random() - 0.5) * (Math.random() * 2);
                        let dy = (Math.random() - 0.5) * (Math.random() * 2);
                        let radius = Math.random() * 3;
                        let particle = new Particle(context, thisx + tileSize/2, thisy + tileSize/2, radius, dx, dy);
                        /* Adds new items like particle*/
                        particles.push(particle); 
                    }
                    explode();
                }, 0);
                score += bonus.score;
                bonus.alive = false;
                bonus=undefined;
            }
        }
        //bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += alien.score + 10 * level + Math.round(alien.y == ship.y ? 0 : 10 *tileSize/(ship.y-alien.y));
                /* Time r is set for particle push execution in intervals*/
                //explode the alien
                setTimeout(() => {
                    particles = [];
                    for (i = 0; i <= 150; i++) {
                        let dx = (Math.random() - 0.5) * (Math.random() * 2);
                        let dy = (Math.random() - 0.5) * (Math.random() * 2);
                        let radius = Math.random() * 3;
                        let particle = new Particle(context, alien.x+alien.width/2, alien.y+alien.height/2, radius, dx, dy);
                        /* Adds new items like particle*/
                        particles.push(particle); 
                    }
                    explode();
                }, 0);
            }
        }
    }
    //clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //removes the first element of the array
    }
    //alien bullets
    for (let i = 0; i < alienBulletArray.length; i++) {
        let bullet = alienBulletArray[i];
        bullet.y += alienBulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        //bullet collision with ship
        if (!bullet.used && detectCollision(bullet, ship)) {
            bullet.used = true;
            lives--;
            if(lives<0)lives=0;
            bulletArray = [];
            alienBulletArray = [];
            if(lives == 0){
                gameOver = true;
                waitNow=true;
                setTimeout(() => {
                    notWaitNow();
                },4000);
            }else{
                //explode the ship
                setTimeout(() => {
                    particles = [];
                    for (i = 0; i <= 150; i++) {
                        let dx = (Math.random() - 0.5) * (Math.random() * 2);
                        let dy = (Math.random() - 0.5) * (Math.random() * 2);
                        let radius = Math.random() * 3;
                        let particle = new Particle(context, ship.x+ship.width/2, ship.y+ship.height/2, radius, dx, dy);
                        /* Adds new items like particle*/
                        particles.push(particle); 
                    }
                    explode();
                }, 0);
                playPending = true;
                waitNow = true;
                setTimeout(() => {
                    notWaitNow();
                },2000);
            }
        }
    }
    //clear alien bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //removes the first element of the array
    }
    //next level
    if (alienCount == 0) {
        //increase the number of aliens in columns and rows by 1
        score += alienColumns * alienRows * 100; //bonus points :)
        alienColumns = Math.min(alienColumns + 1, columns/2 -2); //cap at 16/2 -2 = 6
        alienRows = Math.min(alienRows + 1, rows-4);  //cap at 16-4 = 12
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2; //increase the alien movement speed towards the right
        }
        else {
            alienVelocityX -= 0.2; //increase the alien movement speed towards the left
        }
        alienArray = [];
        bulletArray = [];
        alienBulletArray = [];
        level++;
        bonusAppears = level;
        createAliens();
    }
    //print level
    context.fillStyle="white";
    context.font="20px courier";
    context.fillText("Level: "+level, boardWidth - 130, 20);
    //print lives
    context.fillStyle="white";
    context.font="20px courier";
    context.fillText("Lives: "+lives, 10, 20);

    //print score
    context.fillStyle="lightgray";
    context.font="20px courier";
    let si = context.measureText("Score: ");
    context.fillText("Score: ", board.width/2-si.width, 20);
    context.fillStyle="white";
    context.font="normal 800 32px courier";
    si = context.measureText(score.toString());
    context.fillText(score.toString(), board.width/2, 24);
    context.fillStyle="white";;
    loopCounter++;
    //check if is GameOver and act accordingly
    if(gameOver){  
        cancelAnimationFrame(requestId);
        if(isInHighScores(score)){
            highScore.splice(9,1);
            (async () => {
                const { value: text } = await Swal.fire({
                  input: "text",
                  inputLabel: "You succeed a High-Score. Enter your Name",
                  inputPlaceholder: "Enter your name here...",
                  inputAttributes: {
                    "aria-label": "Enter your name here"
                  },
                });
                if (text) {
                    highScore.push([text, score]);
                    highScore.sort(
                        function(a, b){
                            return a[1] < b[1] ? 1 : -1;// < = descending, > = ascending
                        }
                    );
                    setOutput(highScore);
                }
              })();
            //console.log(highScore);
        }else{
            //console.log("score "+score+" not in high-scores");
        }
        context.fillStyle="yellow";
        context.font="normal 800 52px courier";
        let si1 = context.measureText("Game Over");
        context.fillText("Game Over", boardWidth/2-si1.width/2, boardHeight/2 - 21);
        return;
    }else{
        requestId = requestAnimationFrame(update);
    } 
}

function notWaitNow(){
    waitNow = false;
    context.fillStyle="white";
    context.font="38px courier";
    let si1 = context.measureText("Press any key to continue");
    context.fillText("Press any key to continue", boardWidth/2-si1.width/2, boardHeight/2 + 40);
}

function moveShip(e) {
    // if (gameOver) {
    //     return;
    // }
    if(waitNow) return;
    playPending = false;
    if(gameOver){
        showNewGame();
        return;
    }
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //move left one tile
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; //move right one tile
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            var iType =  r % 3;
            let alien = {
                imgType: iType,  
                img : alienImg[iType][0],
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true,
                imgPos: 0,
                score: (iType+1) * 50,
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if(waitNow)return;
    if (e.code == "Space") {
        //shoot
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

/* Particle explosion function */
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

function showNewGame(){
    context.clearRect(0, 0, board.width, board.height);
    btnStart = document.getElementById("startNewGame");
    btnStart.style.display = "flex";
    setScoreTable();
}

function startNewGame(e){
    btnStart.style.display = "none";
    scoreTable.style.display = "none";
    alienArray = [];
    bulletArray = [];
    alienBulletArray = [];
    lives = 3;
    score = 0;
    gameOver = false;
    particles = [];
    waitNow = false;
    playPending = false; 
    level = 1;
    alienRows = 2;
    alienColumns = 6;
    alienCount = 0; //number of aliens to defeat
    alienVelocityX = 1; //alien moving speed
    //crate a set of aliens for the begining
    createAliens();
    //start the loop requesting AnimationFrame
    requestId = requestAnimationFrame(update);
}

function setScoreTable(){
    scoreTable.textContent = "";
    highScore.sort(
        function(a, b){
            return a[1] < b[1] ? 1 : -1;// < = descending, > = ascending
        }
    );
    var th = document.createElement("th");
    th.colSpan = "2";
    th.textContent = "High Scores";
    th.style.width = "250px";
    scoreTable.appendChild(th);
    for(var i = 0;i < 10; i++){
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.style.textAlign = "left";
        td1.style.color = "white";
        td1.textContent = highScore[i][0];
        tr.appendChild(td1);
        var td2 = document.createElement("td");
        td2.style.textAlign = "right";
        td2.style.color = "white";
        td2.textContent = highScore[i][1];
        tr.appendChild(td2);
        scoreTable.appendChild(tr);    
    }
    scoreTable.style.display = "block";
}

function isInHighScores(val){
    return val > highScore[9][1];
}

function isTimeForBonus(){
    if(bonus != undefined)return false;
    if(bonusAppears<=0)return false;
    for(var i=0;i<alienArray.length;i++)
        if(alienArray[i].y == tileSize)return false;
    if(Math.random() > 0.999){console.log("time for bonus"); return true;}
    return false;
}

// Get/Set HighScores from Server
function getOutput() {
    getRequest(
        'getHighScores.php', // URL for the PHP file
         drawOutput,  // handle successful request
         drawError    // handle error
    );
    return false;
}  
function setOutput(high) {
    getRequest(
        'setHighScores.php?data='+JSON.stringify(high), // URL for the PHP file
         drawSetOutput,  // handle successful request
         drawSetError    // handle error
    );
    return false;
}  
// handles drawing an error message
function drawError() {
    Swal.fire({
        title: "Error in getting Hi-Scores",
        icon: "error",
        text: "Could not get the Hi-Scored table from the server"
    });
}
// handles the response, adds the html
function drawOutput(responseText) {
    highScore = JSON.parse(responseText);
    setScoreTable();
}

function drawSetError(){
    Swal.fire({
        title: "Error in setting Hi-Scores",
        icon: "error",
        text: "Could not set the Hi-Scores table to the server"
    });
}
function drawSetOutput(responseText) {
    console.log("Hi Scores set successfully");
    //setScoreTable();
    // Swal.fire({
    //     title: "Hi-Scores reveived",
    //     text: responseText
    // });
}

// helper function for cross-browser request object
function getRequest(url, success, error) {
    var req = false;
    try{
        // most browsers
        req = new XMLHttpRequest();
    } catch (e){
        // IE
        try{
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            // try an older version
            try{
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                return false;
            }
        }
    }
    if (!req) return false;
    if (typeof success != 'function') success = function () {};
    if (typeof error!= 'function') error = function () {};
    req.onreadystatechange = function(){
        if(req.readyState == 4) {
            return req.status === 200 ? 
                success(req.responseText) : error(req.status);
        }
    }
    req.open("GET", url, true);
    req.send(null);
    return req;
}