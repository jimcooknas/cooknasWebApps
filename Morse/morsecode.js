var text = document.getElementById("textarea");
var morsetext = document.getElementById("morsearea");
var m = new jscw({"wpm": 25, "freq": 558});
m.renderPlayer('player', m);

m.onPlay  = function(){
    m.setText(text.value);
    morsetext.value = convertToMorse(text.value);
}

const morseCode = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--.."
 }
 const convertToMorse = (str) => {
    return str.toUpperCase().split("").map(el => {
       return morseCode[el] ? morseCode[el] : el;
    }).join(" ");
 };