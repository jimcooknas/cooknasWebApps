var cards;// = document.querySelectorAll(".card");
var timer;

var timeLeft = 120;
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let rows = 4;
let cols = 4;
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
let isPlaying = false;
let folder = "images";//starting with jems
var times = {"4x4":120, "4x5":150, "5x6":240, "6x6":270};
var score = 0;
var clicks = 0;
var cardsSelected = false;


window.onload = function() {
    setSelectBox();
    score = 0;
    setupBoard();
}

function initTimer() {
    if(timeLeft <= 0) {
        isPlaying = false;
        return clearInterval(timer);
    }
    timeLeft--;
    document.getElementById("time").innerText = timeToString(timeLeft);
}

function setupBoard(){
    if(timer!=undefined)clearInterval(timer)
    var cardsContainer = document.getElementsByClassName("cards")[0];
    cardsContainer.style.width = (100 * cols).toString() +"px";//"calc(100% / 4 - 10px)";//100*rows;//
    cardsContainer.style.height = (100 * rows).toString() +"px";//"calc(100% / 4 - 10px)";//100*rows;//
    cardsContainer.innerHTML ='';
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            var li = document.createElement("li");
            li.classList.add("card");
            li.style.width = "calc(100% / "+cols.toString()+" - 10px)";
            li.style.height = "calc(100% / "+rows.toString()+" - 10px)";
            var div1 = document.createElement("div");
            div1.classList.add("view");
            div1.classList.add("front-view");
            var img1 = document.createElement("img");
            img1.src = "images/back-card.png";//que_icon.svg";
            img1.alt = "icon";
            div1.appendChild(img1);
            var div2 = document.createElement("div");
            div2.classList.add("view");
            div2.classList.add("back-view");
            var img2 = document.createElement("img");
            img2.src = "images/img-1.png";
            img2.alt = "card-img";
            div2.appendChild(img2);
            li.appendChild(div1);
            li.appendChild(div2);
            cardsContainer.appendChild(li);
        }
    }
    
    cards = document.querySelectorAll(".card");
    //create arr array
    var maxNum = rows * cols / 2;
    arr = [];
    for(var i=0; i<2; i++){
        for(var j = 1; j <= maxNum; j++){
            arr.push(j);
        }
    }
    timeLeft= times[rows.toString()+"x"+cols.toString()];
    isPlaying = false;
    clicks = 0;
    document.getElementById("clicks").textContent = clicks.toString();
    //console.log(arr);
    shuffleCard();
    cards.forEach(card => {
        card.addEventListener("click", flipCard);
    });
    document.getElementById("time").innerText = timeToString(timeLeft);
}

function flipCard({target: clickedCard}) {
    if(!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if(cardOne !== clickedCard && !disableDeck && timeLeft > 0) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == rows * cols / 2) {
            setTimeout(() => {
                disableDeck = true;
                isPlaying = false;
                score += rows * cols + timeLeft - clicks;
                document.getElementById("score").textContent = score.toString();
                return clearInterval(timer);
                //timeLeft = rows * cols * 8;
                //return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    clicks++;
    document.getElementById("clicks").textContent = clicks.toString();
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    //let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = folder + `/img-${arr[i]}.png`;
        if(cardsSelected)imgTag.style.maxWidth = "56px";
        card.addEventListener("click", flipCard);
    });
}

function rowsChanged(){
    if(document.getElementById("fourfour").checked){
        rows = 4;
        cols = 4;
    }else if(document.getElementById("fourfive").checked){
        rows = 4;
        cols = 5;
    }else if(document.getElementById("fivesix").checked){
        rows = 5;
        cols = 6;
    }else{
        rows = 6;
        cols = 6;
    }
    setupBoard();
}

function timeToString(ti){
    //var ti = Math.floor(tt/1000);
    //var h = Math.floor(ti/3600);
    var m = Math.floor(ti/60);
    var s = ti-m*60;
    return m.toString() + ":" + (s > 9 ? s.toString() : "0" + s.toString());
}

//set up selection box
function setSelectBox(){
    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 0; j < ll; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box, and the selected item: */
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        folder = s.options[i].value;
                        if(folder=="cards")
                            cardsSelected=true;
                        else 
                            cardsSelected=false;
                        setupBoard();
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes, and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document, except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);