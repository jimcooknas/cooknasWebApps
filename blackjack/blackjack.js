let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;
let cardsDeck;
let dealerTotalMoney
let yourTotalMoney;
let yourMoney = 5000;
let betMoney;
let bet = 0;
let betIsDone = false;
let money100;
let money500;
let money1000;
let messageEl;
let btnHit;
let btnStay;
let btnNew;
let setReload=false;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

//for card movement
let state=0;
let speed=10;//how many pixels to move per interval
let x=0,y=0;
let xTarget=0,yTarget=0;
let movingCard;

window.onload = function() {
    btnHit = document.getElementById("hit");
    btnHit.addEventListener("click", hit);
    btnStay = document.getElementById("stay");
    btnStay.addEventListener("click", stay);
    btnNew = document.getElementById("new");
    btnNew.addEventListener("click", newGame);
    document.getElementById("chip100").addEventListener("click", addBet100);
    document.getElementById("chip500").addEventListener("click", addBet500);
    document.getElementById("chip1000").addEventListener("click", addBet1000);
    cardsDeck = document.getElementById("card-deck");
    dealerTotalMoney = document.getElementById("dealers-total-money");
    yourTotalMoney = document.getElementById("yours-total-money");
    betMoney = document.getElementById("bet");
    messageEl = document.getElementsByClassName("message")[0];
    btnNew.disabled=true;
    buildDeck();
    shuffleDeck();
    startGame();
}

function newGame(){
    if(setReload)location.reload();
    buildDeck();
    shuffleDeck();
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png">';
    document.getElementById("your-cards").innerHTML = "";
    dealerSum = 0;
    dealerAceCount = 0;
    yourSum = 0;
    yourAceCount = 0;
    betMoney.textContent = "0";
    bet = 0;
    betIsDone = false;
    canHit = true;
    messageEl.style.display = "none";
    startGame();
    btnNew.disabled=true;
    btnHit.disabled=false;
    btnStay.disabled=false;
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
    let w = cardsDeck.offsetWidth-(cardsDeck.offsetWidth-5*6-100)/2-100;
    while (cardsDeck.firstChild) { 
        cardsDeck.removeChild(cardsDeck.firstChild); 
        // OR 
        //cardsDeck.firstChild.remove(); 
    }
    for(let i=0;i<5;i++){
        //console.log(cardsDeck.offsetWidth+"px");
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/BACK.png";
        cardImg.style.left = (w-6*i).toString()+"px";
        cardImg.style.top = (160-6*i).toString()+"px";
        cardsDeck.appendChild(cardImg);
        cardImg.addEventListener("click", hit);
        cardImg.style.cursor = "pointer";
        if(i==4){
            movingCard = document.createElement("img");
            movingCard.src = "./cards/BACK.png";
            movingCard.style.left = (w-6*i).toString()+"px";
            movingCard.style.top = (160-6*i).toString()+"px";
            movingCard.classList.add("moving-card");
            movingCard.style.position = "absolute";
            movingCard.addEventListener("click", hit);
            cardsDeck.appendChild(movingCard);
        }
    }
    console.log("Children="+cardsDeck.children.length);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    //console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
         document.getElementById("your-cards").append(cardImg);
        if(i==1){
            var divRect = document.getElementById("your-cards").getBoundingClientRect();
            var rect = cardImg.getBoundingClientRect();
            xTarget = divRect.left + rect.left;
            yTarget = divRect.top + rect.top;
        }
    }
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";
    btnNew.disabled=true;
    console.log(yourSum);
}

function hit() {
    if (!canHit || !betIsDone) {
        if(!betIsDone)
            Swal.fire({
                title: "Wait",
                text: "Please, first make your bet by mouse-clicking on one or more of your chips"
            });
        return;
    }
    moveCard();
    //*****transfered to moveCard()
    // let cardImg = document.createElement("img");
    // let card = deck.pop();
    // cardImg.src = "./cards/" + card + ".png";
    // yourSum += getValue(card);
    // yourAceCount += checkAce(card);
    // document.getElementById("your-cards").append(cardImg);

    // if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
    //     canHit = false;
    //     stay();
    // }
}

function stay() {
    if(!betIsDone){
        Swal.fire({
            title: "Wait",
            text: "Please, first make your bet by mouse-clicking on one or more of your chips"
        });
        return;
    }
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    let col;
    if (yourSum > 21) {
        message = "You Lose!";
        dealerTotalMoney.textContent = parseInt(dealerTotalMoney.textContent) + bet;
        bet = 0;
        betMoney.textContent = "0";
        col = "#ff0000cc";
    }
    else if (dealerSum > 21) {
        message = "You win!";
        dealerTotalMoney.textContent = parseInt(dealerTotalMoney.textContent) - bet;
        yourMoney += 2 * bet;
        yourTotalMoney.textContent = yourMoney.toString();
        bet = 0;
        betMoney.textContent = "0";
        col = "#00ff00cc";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
        yourMoney += bet;
        yourTotalMoney.textContent = yourMoney.toString();
        bet = 0;
        betMoney.textContent = "0";
        col = "#cccccccc";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        dealerTotalMoney.textContent = parseInt(dealerTotalMoney.textContent) - bet;
        yourMoney += 2 * bet;
        yourTotalMoney.textContent = yourMoney.toString();
        bet = 0;
        betMoney.textContent = "0";
        col = "#00ff00cc";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        dealerTotalMoney.textContent = parseInt(dealerTotalMoney.textContent) + bet;
        bet = 0;
        betMoney.textContent = "0";
        col = "#ff0000cc";
    }
    if(yourMoney<=0){
        message = "You've Lost EVERYTHING";
        setReload=true;
    }
    if(parseInt(dealerTotalMoney.textContent) <= 0){
        message = "You've BLOWN the BANK !!!!";
        setReload=true;
    }
    messageEl.style.display = "block";
    messageEl.style.backgroundColor = col;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    btnNew.disabled=false;
    btnHit.disabled=true;
    btnStay.disabled=true;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function addBet100(e){
    if(yourMoney >= 100){
        bet += 100;
        betMoney.textContent = bet.toString();
        yourMoney -= 100;
        yourTotalMoney.textContent = yourMoney.toString();
        betIsDone=true;
    }
}

function addBet500(e){
    if(yourMoney >= 500){
        bet += 500;
        betMoney.textContent = bet.toString();
        yourMoney -= 500;
        yourTotalMoney.textContent = yourMoney.toString();
        betIsDone=true;
    }
}
function addBet1000(e){
    if(yourMoney >= 1000){
        bet += 1000;
        betMoney.textContent = bet.toString();
        yourMoney -= 1000;
        yourTotalMoney.textContent = yourMoney.toString();
        betIsDone=true;
    }
}

function moveCard(){
    var duration = 500;
    //var rect = movingCard.getBoundingClientRect();
    //x = rect.left;
    //y = rect.top;
    var newMovingCard = movingCard.cloneNode(true);
    cardsDeck.appendChild(newMovingCard);
    //console.log("x="+x+" y="+y);
    var elStyle = window.getComputedStyle(newMovingCard);
    x = parseFloat(elStyle.getPropertyValue("left").replace("px", ""));
    y = parseFloat(elStyle.getPropertyValue("top").replace("px", ""));
    xTarget = x - 240;
    yTarget = y + 180;
    
    var frameDistanceX = (xTarget - x) / (duration / 10);
    var frameDistanceY = (yTarget - y) / (duration / 10);
    //console.log("x="+x+" y="+y+" xTarg="+xTarget+" yTarg="+yTarget+" frameX="+frameDistanceX+" frameY="+frameDistanceY);
    var counter=0;
    function moveAFrame() {
        elStyle = window.getComputedStyle(newMovingCard);
        x = parseFloat(elStyle.getPropertyValue("left").replace("px", ""));
        y = parseFloat(elStyle.getPropertyValue("top").replace("px", ""));
        var newX = x + frameDistanceX;
        var newY = y + frameDistanceY;
        //console.log(counter+". x="+newX+" y="+newY);
        counter++;
        var beyondDestination = (newX < xTarget || newY > yTarget);
        if (beyondDestination) {
            newMovingCard.style["left"] = xTarget + "px";
            newMovingCard.style["top"] = yTarget + "px";
            clearInterval(movingFrames);
            newMovingCard.style.display = "none";
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";
            yourSum += getValue(card);
            yourAceCount += checkAce(card);
            document.getElementById("your-cards").append(cardImg);
            targetImg = cardImg.cloneNode(true);

            if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
                canHit = false;
                stay();
            }
        }else {
            newMovingCard.style["left"] = newX + "px";
            newMovingCard.style["top"] = newY + "px";
        }
    }
    var movingFrames = setInterval(moveAFrame, 10);
}

let getAngle=function(x1,y1,x2,y2){
    return Math.atan2(y2-y1,x2-x1);
}