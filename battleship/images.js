function setPlayerShip(type, rIdx, cIdx, dir){
    switch(type){
        case "carrier":
            for(let i=0;i<imgCarrier.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                player[rIdx+r][cIdx+c].img = (dir == "vertical" ? carrierImage[i] : carrierLRImage[4-i]);
                player[rIdx+r][cIdx+c].value = 1;
                playerCarrier.push([rIdx+r, cIdx+c]);
            }
            break;
        case "destroyer":
            for(let i=0;i<imgDestroyer.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                player[rIdx+r][cIdx+c].img = (dir == "vertical" ? destroyerImage[i] : destroyerLRImage[3-i]);
                player[rIdx+r][cIdx+c].value = 1;
            }
            break;
        case "miner":
            for(let i=0;i<imgMiner.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                player[rIdx+r][cIdx+c].img = (dir == "vertical" ? minerImage[i] : minerLRImage[2-i]);
                player[rIdx+r][cIdx+c].value = 1;
            }
            break;
        case "submarine":
            for(let i=0;i<imgSubmarine.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                player[rIdx+r][cIdx+c].img = (dir == "vertical" ? submarineImage[i] : submarineLRImage[1-i]);
                player[rIdx+r][cIdx+c].value = 1;
            }
            break;
    }
}

function setEnemyShip(type, rIdx, cIdx, dir){
    switch(type){
        case "carrier":
            for(let i=0;i<imgCarrier.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                enemy[rIdx+r][cIdx+c].img = (dir == "vertical" ? carrierImageGray[i] : carrierLRImageGray[4-i]);
                enemy[rIdx+r][cIdx+c].value = 1;
                enemy[rIdx+r][cIdx+c].visible=false;
                enemyCarrier.push([rIdx+r, cIdx+c]);
                shipPartsCounter++;
            }
            break;
        case "destroyer":
            for(let i=0;i<imgDestroyer.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                enemy[rIdx+r][cIdx+c].img = (dir == "vertical" ? destroyerImageGray[i] : destroyerLRImageGray[3-i]);
                enemy[rIdx+r][cIdx+c].value = 1;
                enemy[rIdx+r][cIdx+c].visible=false;
                shipPartsCounter++;
            }
            break;
        case "miner":
            for(let i=0;i<imgMiner.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                enemy[rIdx+r][cIdx+c].img = (dir == "vertical" ? minerImageGray[i] : minerLRImageGray[2-i]);
                enemy[rIdx+r][cIdx+c].value = 1;
                enemy[rIdx+r][cIdx+c].visible=false;
                shipPartsCounter++;
            }
            break;
        case "submarine":
            for(let i=0;i<imgSubmarine.length;i++){
                var r = dir == "vertical" ? i : 0;
                var c = dir == "vertical" ? 0 : i;
                enemy[rIdx+r][cIdx+c].img = (dir == "vertical" ? submarineImageGray[i] : submarineLRImageGray[1-i]);
                enemy[rIdx+r][cIdx+c].value = 1;
                enemy[rIdx+r][cIdx+c].visible=false;
                shipPartsCounter++;
            }
            break;
    }
}

//load images with Promises (onload)
function loadImages(){
    imgCounter = 0;
    loadCarrier(0);
    loadCarrierLR(0);
    loadDestroyer(0);
    loadDestroyerLR(0);
    loadMiner(0);
    loadMinerLR(0);
    loadSubmarine(0);
    loadSubmarineLR(0);
}

function loadGrayImages(){
    loadCarrierGray(0);
    loadCarrierLRGray(0);
    loadDestroyerGray(0);
    loadDestroyerLRGray(0);
    loadMinerGray(0);
    loadMinerLRGray(0);
    loadSubmarineGray(0);
    loadSubmarineLRGray(0);
}

///////////////////////////////////////////////////////////
//loading images with color
//load the next image after the previous is already loaded
function loadCarrier(index){
    var img = new Image();
    img.onload = function(){
        carrierImage.push(this);
        imgCounter++;
        if(index+1 < imgCarrier.length){
            loadCarrier(index+1);
        }
    }
    img.src = "./img/"+imgCarrier[index];
}
function loadCarrierLR(index){
    var img = new Image();
    img.onload = function(){
        carrierLRImage.push(this);
        imgCounter++;
        if(index+1 < imgCarrierLR.length){
            loadCarrierLR(index+1);
        }
    }
    img.src = "./img/"+imgCarrierLR[index];
}

function loadDestroyer(index){
    var img = new Image();
    img.onload = function(){
        destroyerImage.push(this);
        imgCounter++;
        if(index+1 < imgDestroyer.length){
            loadDestroyer(index+1);
        }
    }
    img.src = "./img/"+imgDestroyer[index];
}
function loadDestroyerLR(index){
    var img = new Image();
    img.onload = function(){
        destroyerLRImage.push(this);
        imgCounter++;
        if(index+1 < imgDestroyerLR.length){
            loadDestroyerLR(index+1);
        }
    }
    img.src = "./img/"+imgDestroyerLR[index];
}

function loadMiner(index){
    var img = new Image();
    img.onload = function(){
        minerImage.push(this);
        imgCounter++;
        if(index+1 < imgMiner.length){
            loadMiner(index+1);
        }
    }
    img.src = "./img/"+imgMiner[index];
}
function loadMinerLR(index){
    var img = new Image();
    img.onload = function(){
        minerLRImage.push(this);
        imgCounter++;
        if(index+1 < imgMinerLR.length){
            loadMinerLR(index+1);
        }
    }
    img.src = "./img/"+imgMinerLR[index];
}

function loadSubmarine(index){
    var img = new Image();
    img.onload = function(){
        submarineImage.push(this);
        imgCounter++;
        if(index+1 < imgSubmarine.length){
            loadSubmarine(index+1);
        }
    }
    img.src = "./img/"+imgSubmarine[index];
}
function loadSubmarineLR(index){
    var img = new Image();
    img.onload = function(){
        submarineLRImage.push(this);
        imgCounter++;
        if(index+1 < imgSubmarineLR.length){
            loadSubmarineLR(index+1);
        }
    }
    img.src = "./img/"+imgSubmarineLR[index];
}

/////////////////////////////////////////////////////
//loading gray images
/////////////////////////////////////////////////////
function loadCarrierGray(index){
    var img = new Image();
    img.onload = function(){
        carrierImageGray.push(this);
        imgCounter++;
        if(index+1 < imgCarrier.length){
            loadCarrierGray(index+1);
        }
    }
    img.src = "./img/gray"+imgCarrier[index];
}
function loadCarrierLRGray(index){
    var img = new Image();
    img.onload = function(){
        carrierLRImageGray.push(this);
        imgCounter++;
        if(index+1 < imgCarrierLR.length){
            loadCarrierLRGray(index+1);
        }
    }
    img.src = "./img/gray"+imgCarrierLR[index];
}

function loadDestroyerGray(index){
    var img = new Image();
    img.onload = function(){
        destroyerImageGray.push(this);
        imgCounter++;
        if(index+1 < imgDestroyer.length){
            loadDestroyerGray(index+1);
        }
    }
    img.src = "./img/gray"+imgDestroyer[index];
}
function loadDestroyerLRGray(index){
    var img = new Image();
    img.onload = function(){
        destroyerLRImageGray.push(this);
        imgCounter++;
        if(index+1 < imgDestroyerLR.length){
            loadDestroyerLRGray(index+1);
        }
    }
    img.src = "./img/gray"+imgDestroyerLR[index];
}

function loadMinerGray(index){
    var img = new Image();
    img.onload = function(){
        minerImageGray.push(this);
        imgCounter++;
        if(index+1 < imgMiner.length){
            loadMinerGray(index+1);
        }
    }
    img.src = "./img/gray"+imgMiner[index];
}
function loadMinerLRGray(index){
    var img = new Image();
    img.onload = function(){
        minerLRImageGray.push(this);
        imgCounter++;
        if(index+1 < imgMinerLR.length){
            loadMinerLRGray(index+1);
        }
    }
    img.src = "./img/gray"+imgMinerLR[index];
}

function loadSubmarineGray(index){
    var img = new Image();
    img.onload = function(){
        submarineImageGray.push(this);
        imgCounter++;
        if(index+1 < imgSubmarine.length){
            loadSubmarineGray(index+1);
        }
    }
    img.src = "./img/gray"+imgSubmarine[index];
}
function loadSubmarineLRGray(index){
    var img = new Image();
    img.onload = function(){
        submarineLRImageGray.push(this);
        imgCounter++;
        if(index+1 < imgSubmarineLR.length){
            loadSubmarineLRGray(index+1);
        }
    }
    img.src = "./img/gray"+imgSubmarineLR[index];
}

function grayShipImage(img){
    for(var i=0; i<carrierImage.length;i++)
        if(img == carrierImage[i])
            return carrierImageGray[i];
    for(var i=0; i<carrierLRImage.length;i++)
        if(img == carrierLRImage[i])
            return carrierLRImageGray[i];
    
    for(var i=0; i<destroyerImage.length;i++)
        if(img == destroyerImage[i])
            return destroyerImageGray[i];
    for(var i=0; i<destroyerLRImage.length;i++)
        if(img == destroyerLRImage[i])
            return destroyerLRImageGray[i];

    for(var i=0; i<minerImage.length;i++)
        if(img == minerImage[i])
            return minerImageGray[i];
    for(var i=0; i<minerLRImage.length;i++)
        if(img == minerLRImage[i])
            return minerLRImageGray[i];

    for(var i=0; i<submarineImage.length;i++)
        if(img == submarineImage[i])
            return submarineImageGray[i];
    for(var i=0; i<submarineLRImage.length;i++)
        if(img == submarineLRImage[i])
            return submarineLRImageGray[i];

    return undefined;
}