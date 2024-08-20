const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;
var setFirstLast = true;
var level = 0;
var logWord = false;

const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    
    hangmanImage.src = "images/kremala-0.png";//hangman
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
    //check if we must reveal the first and the last letter
    if(setFirstLast){
        var letterList = [];
        [...currentWord].forEach((letter, index) => {
            if(letter === currentWord[0] || letter === currentWord[currentWord.length-1]) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
                letterList.push(letter);
            }
        }); 
        //disable keys of the first and last letter
        keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = letterList.includes(btn.textContent));
    }
}

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    if(level==0){
        var { word, hint } = wordList[Math.floor(Math.random() * 65)];
        document.getElementById("words-count").innerHTML = "Lexicon words: <b>65</b> (with hints)";
    }else if(level == 1){
        var { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
        document.getElementById("words-count").innerHTML = "Lexicon words: <b>" + wordList.length + "</b> (some with hints)";
    }else if(level == 2){
        var { word, hint } = wordList_Long[Math.floor(Math.random() * wordList_Long.length)];
        document.getElementById("words-count").innerHTML = "Lexicon words: <b>" + wordList_Long.length + "</b> (no hints)";
    }else{
        var { word, hint } = wordListGreek[Math.floor(Math.random() * wordListGreek.length)];
        document.getElementById("words-count").innerHTML = "Lexicon words: <b>" + wordListGreek.length + "</b> (no hints)";
    }
    if(word.length < 6 || word.length > 12){
        getRandomWord;
        return;
    }else{
        word = word.toLowerCase();
        createKeyboard(level);
        if(logWord)console.log(word);
        currentWord = word; // Making currentWord as random word
        document.querySelector(".hint-text b").innerText = hint;
        resetGame();
    }
}

const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/kremala-${wrongGuessCount}.png`;//hangman
    }
    button.disabled = true; // Disabling the clicked button so user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
function createKeyboard(lev){
    keyboardDiv.innerHTML = '';
    if(lev<3){
        for (let i = 97; i <= 122; i++) {
            const button = document.createElement("button");
            button.innerText = String.fromCharCode(i);
            keyboardDiv.appendChild(button);
            button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
        }
    }else{
        for (let i = 945; i <= 969; i++) {
            if(i!=962){//this is the letter 'ς' that already entered by 'σ'
                const button = document.createElement("button");
                button.innerText = String.fromCharCode(i);
                keyboardDiv.appendChild(button);
                button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
            }
        }
    }
}

function showFirstLastChanged(){
    setFirstLast = document.getElementById("showFirstLast").checked;
    getRandomWord();
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);

document.getElementsByClassName("hangman-box")[0].addEventListener("click", getRandomWord);

///////////////////////////////////////////////////////////
//////////////           custom select      ///////////////
///////////////////////////////////////////////////////////
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
                s.selectedIndex = i;
                level = parseInt(s.selectedIndex);//change the level
                getRandomWord();//and randomly select new word
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

/* If the user clicks anywhere outside the select box, then close all select boxes: */
document.addEventListener("click", closeAllSelect);