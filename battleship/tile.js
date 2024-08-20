/** Tile class that describes a tile on the board with properties:
 * id, row, col, width, value, img and visible
 */
class Tile{
    constructor(id, r, c, w){
        this.id = id;
        this.row = r;
        this.col = c;
        this.width = w;
        this.value = 0;
        this.img = undefined;
        this.visible = true;
    }

    draw(ctx){
        if(this.id == "pointer"){
            ctx.strokeStyle = "lightgreen"; 
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.col*this.width+this.width/2, this.row*this.width+this.width/2, 1.5*this.width/2, 0, 2*Math.PI);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.moveTo(this.col*this.width+this.width/2, this.row*this.width - this.width/2);
            ctx.lineTo(this.col*this.width+this.width/2, this.row*this.width + this.width/2 - 6);
            ctx.moveTo(this.col*this.width+this.width/2, this.row*this.width + this.width + this.width/2);
            ctx.lineTo(this.col*this.width+this.width/2, this.row*this.width + this.width/2 + 6);
            ctx.moveTo(this.col*this.width-this.width/2, this.row*this.width + this.width/2);
            ctx.lineTo(this.col*this.width+this.width/2 - 6, this.row*this.width + this.width/2);
            ctx.moveTo(this.col*this.width+this.width/2 + 6, this.row*this.width + this.width/2);
            ctx.lineTo(this.col*this.width+this.width/2 + this.width, this.row*this.width + this.width/2);
            ctx.stroke();
        }else{
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.fillStyle = this.value == -1 ? "#103791" : "#103791";//"blue";
            ctx.beginPath();
            ctx.roundRect(this.col*this.width, this.row*this.width, this.width,this.width, 6);
            if(this.value < 0)ctx.fill();
            ctx.stroke();
            if(this.img!=undefined && this.visible){
                ctx.drawImage(this.img, this.col*this.width, this.row*this.width, this.width, this.width);
            }
        }
    }
}

/** A class that decribe a full ship (2 or 3 or 4 or 5 parts) with properties: type, row, col, dir and img[] */
class Ship{
    constructor(type, r, c, dir){
        this.type = type;
        this.row = r;
        this.col = c;
        this.dir = dir;
        this.img = [];
        switch(type){
            case 2:
                for(var i=0;i<submarineImage.length;i++)
                    this.img.push(dir == "vertical" ? submarineImage[i] : submarineLRImage[1-i]);
                break;
            case 3:
                for(var i=0;i<minerImage.length;i++)
                    this.img.push(dir == "vertical" ? minerImage[i] : minerLRImage[2-i]);
                break;
            case 4:
                for(var i=0;i<destroyerImage.length;i++)
                    this.img.push(dir == "vertical" ? destroyerImage[i] : destroyerLRImage[3-i]);
                break;
            case 5:
                for(var i=0;i<carrierImage.length;i++)
                    this.img.push(dir == "vertical" ? carrierImage[i] : carrierLRImage[4-i]);
                break;
        }
    }

    draw(ctx){
        for(var i=0; i<this.img.length; i++){
            if(this.dir == "vertical")
                ctx.drawImage(this.img[i], this.col*tileSize, (this.row+i)*tileSize);
            else
                ctx.drawImage(this.img[i], (this.col+i)*tileSize, this.row*tileSize);
        }
    }
}

/** This function returns true if the specified row and col contains one part of the enemy's or player's carrier */
function isCarrier(r,c, carrier){
    for(var i=0;i<carrier.length;i++){
        if(r == carrier[i][0] && c == carrier[i][1])
            return true;
    }
    return false;
}

/** Set he Playing now 'Player' or 'Enemy' */
function setPlayer(){
    document.getElementById("playingNow").textContent = isPlaying == 1 ? "Player" : "Enemy";
    document.getElementById("playingNow").style.color = isPlaying == 1 ? "blue" : "red";
}

/** Sets the number of hits in the game for both the Player and the Enemy */
function setHits(){
    document.getElementById("playerHits").textContent = playerScore.toString();
    document.getElementById("enemyHits").textContent = enemyScore.toString();
}

/** Set the shots for the current round, either for Player or for the Enemy */
function setRoundHits(){
    document.getElementById("roundHits").textContent = isPlaying == 1 ? "("+playerShots+"/"+playerMaxShots+")" : "("+enemyShots+"/"+enemyMaxShots+")";
}

/** Set the Finale of the Game either Player or Enemy WINS */
function setFinale(winner){
    document.getElementById("spanIsPlaying").style.display="none";
    document.getElementById("roundHits").style.display="none";
    var lbl = document.getElementById("playingNow")
    lbl.textContent = winner === "enemy" ? "ENEMY WINS" : "PLAYER WINS";
    lbl.style.fontSize="28px";
    lbl.style.fontColor= winner === "enemy" ? "red" : "blue";
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            if(enemy[i][j].value > 0){
                enemy[i][j].visible = true;
                enemy[i][j].draw(ctxEN);
            }
        }
    }
    isPlaying = 0;
    btnNewGame.disabled=false;
    btnSetupGame.disabled=false;
    btnQuitGame.disabled=true;
    cancelAnimationFrame(requestID);
    Swal.fire({
        title: "Winner is " + winner,
        html: "The " + winner + " won the game with " + (shipPartsCounter - (winner=="player"?enemyScore:playerScore)).toString() +" ship-parts left",
        footer: "Great Victory!!!",
    });
}

/** Sets the background color of the labels of currently selected ship to be placed on the board, during SetupGame */
function colorSetupType(type){
    document.getElementById("submarines-left").style.backgroundColor = "orange";
    document.getElementById("miners-left").style.backgroundColor = "orange";
    document.getElementById("destroyers-left").style.backgroundColor = "orange";
    document.getElementById("carriers-left").style.backgroundColor = "orange";
    switch(type){
        case 2:
            document.getElementById("submarines-left").style.backgroundColor = "red";
            document.getElementById("submarines-left").children[0].textContent = setupSubmarines + " / " + numOfSubmarines;
            break;
        case 3:
            document.getElementById("miners-left").style.backgroundColor = "red";
            document.getElementById("miners-left").children[0].textContent = setupMiners + " / " + numOfMiners;
            break;
        case 4:
            document.getElementById("destroyers-left").style.backgroundColor = "red";
            document.getElementById("destroyers-left").children[0].textContent = setupDestroyers + " / " + numOfDestroyers;
            break;
        case 5:
            document.getElementById("carriers-left").style.backgroundColor = "red";
            document.getElementById("carriers-left").children[0].textContent = setupCarriers + " / " + numOfCarriers;
            break;
    }
}

function getCandidates(r, c){
    var candi = [];
    if(r > 0 && player[r-1][c].value >= 0)candi.push([r-1, c, "ver"]);
    if(r < rows-1 && player[r+1][c].value >= 0)candi.push([r+1, c, "ver"]);
    if(c > 0 && player[r][c-1].value >= 0)candi.push([r, c-1, "hor"]);
    if(c < cols-1 && player[r][c+1].value >= 0)candi.push([r, c+1, "ver"]);
    return candi;
}