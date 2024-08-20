function playerMouseMove(e){
    if(!isSettingGame)return;
    mouseOver = true;
    var r = Math.min(Math.floor(e.offsetY/tileSize), rows - (setupDir == "vertical" ? setupType : 0));
    var c = Math.min(Math.floor(e.offsetX/tileSize), cols - (setupDir == "vertical" ? 0 : setupType));
    setupTile.row = r;
    setupTile.col = c;
}

function playerMouseLeave(e){
    if(!isSettingGame)return;
    mouseOver=false;
}

function playerMouseClick(e){
    if(!isSettingGame)return;
    var r = Math.min(Math.floor(e.offsetY/tileSize), rows - (setupDir == "vertical" ? setupType : 0));
    var c = Math.min(Math.floor(e.offsetX/tileSize), cols - (setupDir == "vertical" ? 0 : setupType));
    //check if ship places are occupied
    if(positionNotFree(r, c, setupDir, setupType))return;

    for(var i=0;i<setupType;i++){
        if(setupDir == "vertical"){
            player[r+i][c].value = 1;
            player[r+i][c].img = setupType == 2 ? submarineImage[i] : setupType == 3 ? minerImage[i] : setupType == 4 ? destroyerImage[i] : carrierImage[i];
        }else{
            player[r][c+i].value = 1;
            player[r][c+i].img = setupType == 2 ? submarineLRImage[1-i] : setupType == 3 ? minerLRImage[2-i] : setupType == 4 ? destroyerLRImage[3-i] : carrierLRImage[4-i];
        }
    }
    switch(setupType){
        case 2:
            setupSubmarines++;
            colorSetupType(setupType);
            if(setupSubmarines == numOfSubmarines){
                //we finished
                designPanel.style.display = "none";
                playPanel.style.display = "block";
                isSettingGame = false;
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
                candidate = [];
                setPlayer();
                setRoundHits();
                cancelAnimationFrame(requestSetID);
                console.log(printBoard("player").replace(new RegExp('&nbsp;', 'g')," ").replace(new RegExp('  ', 'g'),' '));
                requestID = requestAnimationFrame(gameLoop);
                return;
            }
            break;
        case 3:
            setupMiners++;
            colorSetupType(setupType);
            if(setupMiners == numOfMiners){
                setupType--;
                setupTile = new Ship(setupType, r, c, setupDir);
                colorSetupType(setupType);
            }
            break;
        case 4:
            setupDestroyers++;
            colorSetupType(setupType);
            if(setupDestroyers == numOfDestroyers){
                setupType--;
                setupTile = new Ship(setupType, r, c, setupDir);
                colorSetupType(setupType);
            }
            break;
        case 5:
            setupCarriers++;
            colorSetupType(setupType);
            if(setupCarriers == numOfCarriers){
                setupType--;
                setupTile = new Ship(setupType, r, c, setupDir);
                colorSetupType(setupType);
            }
            break;
    }
}

function setupLoop(){
    ctxPL.clearRect(0, 0, boardWidth, boardWidth);
    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){
            player[r][c].draw(ctxPL);
        }
    }
    if(mouseOver)
        setupTile.draw(ctxPL);
    requestSetID = requestAnimationFrame(setupLoop);
}

function playerRotate(){
    if(!isSettingGame)return;
    setupDir = (setupDir == "vertical" ? "horizontal" : "vertical");
    setupTile = new Ship(setupType, r, c, setupDir);
}

function positionNotFree(r, c, dir, type){
    for(var i=0;i<type;i++){
        if(dir == "vertical"){
            if(player[r+i][c].value > 0) return true;
        }else{
            if(player[r][c+i].value > 0) return true;
        }
    }
    return false;
}


function printBoard(whos, conClear = false){
    var lines = [];
    if(conClear)console.clear();
    //lines.push(whos + ":<br>");
    var what = whos == "player" ? player : enemy;
    for(var r = 0; r < rows; r++){
        var li = ""
        for(var c =0 ; c < cols; c++){
            li += what[r][c].value < 0 ? "&nbsp;" + what[r][c].value : "&nbsp;&nbsp;"+what[r][c].value;
        }
        lines.push(li);
    }
    return "\r\n"+lines.join('\r\n');
}