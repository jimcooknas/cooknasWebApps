//Originally developed by © 101Computing.net 
//Re-arranged by cooknas.com

class Point{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class EnigmaSettings{
    constructor(rot, rings, plugs, init){
        this.rotor = rot;
        this.rings = rings;
        this.plugs = plugs;
        this.initPos = init;
    }
}

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const appSettings = [
    new EnigmaSettings("V III II","AKK","AO HI MU SN VX ZQ","FDV"),
    new EnigmaSettings("IV III V","JHS","LW RH UQ VP YM ZA","OTO"),
    new EnigmaSettings("IV I II","DIL","EM HL PZ RJ SV UQ","JJK"),
    new EnigmaSettings("III I IV","ICC","AX CW FZ KT PO SQ","RXV"),
    new EnigmaSettings("IV II III","ECW","GS JD MN OQ VF XH","GUB"),
    new EnigmaSettings("V III I","MFO","DW GO HE UF YI ZJ","ZBY"),
    new EnigmaSettings("V III I","UCO","GC JU KE MF OD XY","BOT"),
    new EnigmaSettings("II V IV","RWQ","BN FK OS PW TA ZE","IYM"),
    new EnigmaSettings("IV II I","TRK","BN DU JI OK TF XC","SFX"),
    new EnigmaSettings("II V III","CTZ","AF BK GJ VQ XH YT","TQO"),
    new EnigmaSettings("I V III","XOM","BX IS LY NF QO WA.","DKV"),
    new EnigmaSettings("IV V II","LDQ","CR FO LI NM PD XH","JAH"),
    new EnigmaSettings("IV I III","NWL","HV IM JB OT QA UF","HSP"),
    new EnigmaSettings("II IV III","HFZ","FE IB OQ VC YW ZM","GPZ"),
    new EnigmaSettings("II I IV","UBJ","CO GV IH KO ML RB","PJU"),
    new EnigmaSettings("I II IV","BCG","ES GD IZ JF LN YA","KFQ"),
    new EnigmaSettings("II V IV","EAP","BT CO NE PK VY ZI","CCH"),
    new EnigmaSettings("I V II","AOK","CA DZ HK LP RQ YV","DNF"),
    new EnigmaSettings("III I II","CKU","CK IZ QT NP JY GW","VQN"),
    new EnigmaSettings("II III I","BHN","FR LY OX IT BM GJ","XJO"),
    new EnigmaSettings("I V II","QKP","AF HQ IJ OT PB YG","MSW"),
    new EnigmaSettings("V I II","UTC","DE FT IP OB CC YL","EQL"),
    new EnigmaSettings("V IV II","GDJ","GT HR JI OK QE UZ","PLE"),
    new EnigmaSettings("I II III","WNM","HK CN IO FY JM LW","RAO"),
    new EnigmaSettings("VI Ill","ETT","FT HC KO PM YO ZB","HXA"),
    new EnigmaSettings("V I III","MHY","BZ HS JF MW NG PV","XXJ"),
    new EnigmaSettings("IV V III","WXE","DG IK JI UC VB WZ","OFP"),
    new EnigmaSettings("IV II III","LIQ","BJ HC PI RF UO ZQ","KTR"),
    new EnigmaSettings("II I V","NQC","AV KZ MS QP XF YU","ZJR"),
    new EnigmaSettings("V II I","IHQ","ET LD NP QS RA UW","UJJ")
];

var zoom = 0.97;
var logMode=false;

function applyZoom(x) {
    if ((x>0) && (zoom<1.4)) {
        zoom+=0.1; document.getElementById('enigmaZoom').style.zoom = zoom;
    } 
    if ((x<0) && (zoom>0.5)) {
        zoom-=0.1; document.getElementById('enigmaZoom').style.zoom = zoom;
    }
}
applyZoom(-0.1);


var enigma = document.getElementById("enigmaWrapper");

var powerOn=true;
var onoff = document.getElementById("onoff");
onoff.addEventListener("click",function(){
    powerOn = !onoff.checked;
    var keyboardSound = new Audio('./sounds/keyboard.mp3');
    keyboardSound.play();
    console.log(powerOn);
});

var jg = new jsGraphics(enigma);


var sound = true;
var mode = "Encrypt";
//Rotors - https://en.wikipedia.org/wiki/Enigma_rotor_details
var rotor1 = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
var rotor1Trigger = "Q"; //Notch Position
var rotor2 = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
var rotor2Trigger = "E"; //Notch Position
var rotor3 = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
var rotor3Trigger = "V"; //Notch Position
var rotor4 = "ESOVPZJAYQUIRHXLNFTGKDCMWB";
var rotor4Trigger = "J"; //Notch Position
var rotor5 = "VZBRGITYUPSDNHLXAWMJQOFECK";
var rotor5Trigger = "Z"; //Notch Position
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var rotorANotch=false;
var rotorBNotch=false;
var rotorCNotch=false;
var letterCount = 0;

//(AY) (BR) (CU) (DH) (EQ) (FS) (GL) (IP) (JX) (KN) (MO) (TZ) (VW)
var reflectorB = {"A":"Y","Y":"A","B":"R","R":"B","C":"U","U":"C","D":"H","H":"D","E":"Q","Q":"E","F":"S","S":"F","G":"L","L":"G","I":"P","P":"I","J":"X","X":"J","K":"N","N":"K","M":"O","O":"M","T":"Z","Z":"T","V":"W","W":"V"};

var reflectorC = {"A":"F","F":"A","B":"V","V":"B","C":"P","P":"C","D":"J","J":"D","E":"I","I":"E","G":"O","O":"G","H":"Y","Y":"H","K":"R","R":"K","L":"Z","Z":"L","M":"X","X":"M","N":"W","W":"N","Q":"T","T":"Q","S":"U","U":"S"};

var reflector = reflectorB;
var reflectorName = "UKW-B";

//var reflectora = "EJMZALYXVBWFCRQUONTSPIKHGD"; //a M3
//var reflectorb = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; //b M3
//var reflectorc = "FVPJIAOYEDRZXWGCTKUQSBNMHL"; //c M3
var activePlugs = {};
var rotorA = rotor1;
var rotorB = rotor2;
var rotorC = rotor3;
var rotorATrigger = rotor1Trigger;
var rotorBTrigger = rotor2Trigger;
var rotorCTrigger = rotor3Trigger;

var colors = {"red":0,"yellow":0,"blue":0,"green":0,"magenta":0,"cyan":0,"orangered":0,"maroon":0,"indigo":0,"olive":0,"sienna":0,"lime":0,"teal":0};
           
var currentColor = "";
var currentLetter = "";
var firstPlug;
var ropePrecision=0.1;
var topOffset=0;//120;

function getFreeColor() {
 for(var key in colors) {
    if (colors[key]==0) return key;
   }
}
             
var plugs = {};
plugs["Q"] = "";
plugs["W"] = "";
plugs["E"] = "";
plugs["R"] = "";
plugs["T"] = "";
plugs["Z"] = "";
plugs["U"] = "";
plugs["I"] = "";
plugs["O"] = "";
plugs["A"] = "";
plugs["S"] = "";
plugs["D"] = "";
plugs["F"] = "";
plugs["G"] = "";
plugs["H"] = "";
plugs["J"] = "";
plugs["K"] = "";
plugs["P"] = "";
plugs["Y"] = "";
plugs["X"] = "";
plugs["C"] = "";
plugs["V"] = "";
plugs["B"] = "";
plugs["N"] = "";
plugs["M"] = "";
plugs["L"] = "";

function resetPlug(color) {
    var elements = document.getElementsByClassName("plug");
    jg.clear();
    for(var i = 0; i < elements.length; i++) {
        if (elements.item(i).style.background==color) {
            elements.item(i).style.background = "";
            if(color in activePlugs)
                delete activePlugs[color];
        }
    }
    for(var key in activePlugs){
        var col = key;
        jg.setStroke(6);
        jg.setColor(col);
        for (var i = 1; i < activePlugs[col].length; i++){
            jg.drawLine(activePlugs[col][i-1].x, activePlugs[col][i-1].y, activePlugs[col][i].x, activePlugs[col][i].y);
        }
        jg.paint();
    }
    colors[color]=0;
}

function plug(element) {
    letter = element.innerText;
    if (sound) {
        var plugboardSound = new Audio('./sounds/plugboard.mp3');
        plugboardSound.play();
    }
 
    if (element.style.background == "") {
        if (currentColor=="") {
            currentColor = getFreeColor()
            element.style.background = currentColor;
            currentLetter = letter;
            firstPlug = element;
        } else {
            plugs[letter]=currentLetter;
            plugs[currentLetter]=letter;
            currentLetter=letter;
        
            element.style.background = currentColor;
            colors[currentColor] = 2;
            
            var rect1 = firstPlug.getBoundingClientRect();
            var rect2 = element.getBoundingClientRect();
            //console.log("scrollX="+window.scrollX+" scrollY="+window.scrollY+" zoom="+zoom);
            //divide window.scrollY with zoom
            var x1 = rect1.left + rect1.width/2 + window.scrollX;
            var y1 = rect1.top + rect1.height/2 + window.scrollY/zoom + topOffset;
            var x2 = rect2.left + rect2.width/2 + window.scrollX;
            var y2 = rect2.top + rect2.height/2 + window.scrollY/zoom + topOffset;
            var d = 1.2*Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
            var points = catenary(x1, y1, x2, y2, d);
            activePlugs[currentColor]=points;
            jg.setStroke(6);
            jg.setColor(currentColor);
            for (var i = 1; i < points.length; i++){
                jg.drawLine(points[i-1].x, points[i-1].y, points[i].x, points[i].y);
            }

            jg.paint();
            currentColor = "";
            currentLetter = "";
        }
    } else {
        if (element.style.background ==currentColor) {
            resetPlug(element.style.background);
            currentColor="";
        }else{
            colors[element.style.background] = 0;
            tmp = plugs[letter]; 
            plugs[letter]  = "";
            if (tmp!="") plugs[tmp]="";
            resetPlug(element.style.background);
            element.style.background = "";
        }
    }
}

function showLog() {
    if (logMode==true) {
        logMode = false;
        document.getElementById("log").style.display="none";
        document.getElementsByClassName("logo")[0].style.display="block";
    } else {
        logMode = true;
        document.getElementById("log").style.display="block";
        document.getElementsByClassName("logo")[0].style.display="none";
    }
}

function log(txt) {
    if (logMode==true) document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + txt;// + "<br/>"; 
}

function clearLog() {
    document.getElementById("log").innerHTML = "<H1>Encryption Steps:</H1>"; 
    document.getElementById("log").innerHTML+=" Input Plug Whl3 Whl2 Whl1 Refl Whl1 Whl2 whl3 Plug&nbsp;&nbsp;Out<br/>";
}

function encryptKey(letter) {
    var plaintext = document.getElementById("plaintext");
    var ciphertext = document.getElementById("ciphertext");
    var keyboardSound = new Audio('./sounds/keyboard.mp3');
    keyboardSound.play();
    plaintext.innerHTML = plaintext.innerHTML + letter;
    
    var encryptedLetter = letter;

    log("&nbsp;&nbsp;<b>"+letter+"</b>&nbsp;&nbsp;&nbsp;");
    //Rotate Rotors // This happens as soon as a key is pressed, before encrypting the letter!
    //Third rotor rotate by 1 for every key being pressed
    var rotorCLetter = document.getElementById("rotor3Current").innerText;
    if (rotorCLetter == rotorCTrigger) rotorCNotch = true;  
    var previous = alphabet.indexOf(rotorCLetter);
    var current = (previous + 1) % 26;
    var next = (previous + 2) % 26;
    
    document.getElementById("rotor3Previous").innerText = rotorCLetter;
    rotorCLetter = alphabet.charAt(current);
    document.getElementById("rotor3Current").innerText = rotorCLetter;
    document.getElementById("rotor3Next").innerText = alphabet.charAt(next);
    
    //Check if rotorB needs to rotate
    if (rotorCNotch) {
        rotorCNotch=false;
        var rotorBLetter = document.getElementById("rotor2Current").innerText;
        if (rotorBLetter == rotorBTrigger) rotorBNotch = true; 
        previous = alphabet.indexOf(rotorBLetter);
        current = (previous + 1) % 26;
        next = (previous + 2) % 26;
        document.getElementById("rotor2Previous").innerText = rotorBLetter;
        rotorBLetter = alphabet.charAt(current);
        document.getElementById("rotor2Current").innerText = rotorBLetter;
        document.getElementById("rotor2Next").innerText = alphabet.charAt(next);
        //Check if rotorA needs to rotate
        if (rotorBNotch) {
            rotorBNotch=false;
            var rotorALetter = document.getElementById("rotor1Current").innerText;
        
            previous = alphabet.indexOf(rotorALetter);
            current = (previous + 1) % 26;
            next = (previous + 2) % 26;
            document.getElementById("rotor1Previous").innerText = rotorALetter;
            document.getElementById("rotor1Current").innerText = alphabet.charAt(current);
            document.getElementById("rotor1Next").innerText = alphabet.charAt(next);
        } 
    } else {
        //Check for double step sequence!
        rotorBLetter = document.getElementById("rotor2Current").innerText;
        if ( rotorBLetter == rotorBTrigger) { 
            previous = alphabet.indexOf(rotorBLetter);
            current = (previous + 1) % 26;
            next = (previous + 2) % 26;
            document.getElementById("rotor2Previous").innerText = rotorBLetter;
            rotorBLetter = alphabet.charAt(current);
            document.getElementById("rotor2Current").innerText = rotorBLetter;
            document.getElementById("rotor2Next").innerText = alphabet.charAt(next);

            var rotorALetter = document.getElementById("rotor1Current").innerText;
            
            previous = alphabet.indexOf(rotorALetter);
            current = (previous + 1) % 26;
            next = (previous + 2) % 26;
            document.getElementById("rotor1Previous").innerText = rotorALetter;
            document.getElementById("rotor1Current").innerText = alphabet.charAt(current);
            document.getElementById("rotor1Next").innerText = alphabet.charAt(next);
        }
    }
    
    //Implement plugboard encryption!
    if (plugs[letter]!="") encryptedLetter = plugs[letter];
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    
    //Rotors & Reflector Encryption
    var offset3Letter = document.getElementById("rotor3Current").innerText;
    var offset3 = alphabet.indexOf(offset3Letter);
    var offset2Letter = document.getElementById("rotor2Current").innerText;
    var offset2 = alphabet.indexOf(offset2Letter);
    var offset1Letter = document.getElementById("rotor1Current").innerText;
    var offset1 = alphabet.indexOf(offset1Letter);
    letterCount++;
    //Wheel3
    var pos = alphabet.indexOf(encryptedLetter);
    var let = rotorC.charAt((pos + offset3)%26);  
    pos = alphabet.indexOf(let);
    encryptedLetter = alphabet.charAt((pos - offset3 +26)%26);
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");

    //Wheel2
    pos = alphabet.indexOf(encryptedLetter);
    let = rotorB.charAt((pos + offset2)%26);  
    pos = alphabet.indexOf(let);
    encryptedLetter = alphabet.charAt((pos - offset2 +26)%26); 
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    
    //Wheel1
    pos = alphabet.indexOf(encryptedLetter);
    let = rotorA.charAt((pos + offset1)%26);  
    pos = alphabet.indexOf(let);
    encryptedLetter = alphabet.charAt((pos - offset1 +26)%26); 
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;"); 
    
    //reflector
    if (encryptedLetter in reflector) encryptedLetter = reflector[encryptedLetter];
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    //Back through the rotors 
    //Wheel1  
    pos = alphabet.indexOf(encryptedLetter);
    let = alphabet.charAt((pos + offset1)%26);  
    pos = rotorA.indexOf(let);
    encryptedLetter = alphabet.charAt((pos - offset1 +26)%26); 
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    
    //Wheel2
    pos = alphabet.indexOf(encryptedLetter);
    let = alphabet.charAt((pos + offset2)%26);       
    pos = rotorB.indexOf(let);
    encryptedLetter = alphabet.charAt((pos - offset2 +26)%26); 
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    
    //Wheel3
    pos = alphabet.indexOf(encryptedLetter);
    let = alphabet.charAt((pos + offset3)%26);      
    pos = rotorC.indexOf(let);
    encryptedLetter = alphabet.charAt((pos - offset3 + 26)%26); 
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    
    //Implement plugboard encryption!
    if (plugs[encryptedLetter]!="") encryptedLetter = plugs[encryptedLetter];
    log("&nbsp;&nbsp;"+encryptedLetter+"&nbsp;&nbsp;");
    log("&nbsp;&nbsp;<b>"+encryptedLetter+"</b>");
    log("<br/>");
    
    ciphertext.innerHTML = ciphertext.innerHTML + encryptedLetter;
    if ((letterCount%5)==0) {
        ciphertext.innerHTML = ciphertext.innerHTML + " ";
        plaintext.innerHTML = plaintext.innerHTML + " ";
    }
    lightOn(encryptedLetter);
}

function lightOn(letter) {
    //turn all the lights off
    var elements = document.getElementsByClassName("lightOn");
    for (var i = 0; i < elements.length; i++)
        elements.item(i).className = "light";
    
    document.getElementById("light"+letter).className="lightOn";
    setTimeout(function(){
        document.getElementById("light"+letter).className="light"; 
    }, 800);
}

function keyOn(letter) {
    document.getElementById("key"+letter).className="keyOn";
    setTimeout(function(){       
        document.getElementById("key"+letter).className="key"; 
    }, 500);
}

function pressKey(key) {
    if(!powerOn)return;
    var letter = key.innerText;
    encryptKey(letter);
}

document.addEventListener("keypress", checkKey);

function checkKey(event) {
    if(!powerOn)return;
    var charCode = event.which || event.keyCode;
    var char  = String.fromCharCode(charCode); 
    char = char.toUpperCase();
    //Only accept letters from the alphabet!
    if (alphabet.includes(char)) {
        encryptKey(char);
        keyOn(char);
    }
}

function nextRotor(rotor) {
    event.stopPropagation();
    var wheelSound = new Audio('./sounds/wheel.mp3');
    wheelSound.play();
    var rotorLetter = document.getElementById("rotor" +rotor+ "Current").innerText;
    var previous = alphabet.indexOf(rotorLetter);
    var current = (previous + 1) % 26;
    var next = (previous + 2) % 26;
    document.getElementById("rotor" +rotor+ "Previous").innerText = rotorLetter;
    document.getElementById("rotor" +rotor+ "Current").innerText = alphabet.charAt(current);
    document.getElementById("rotor" +rotor+ "Next").innerText = alphabet.charAt(next);
}

function previousRotor(rotor) {
    event.stopPropagation();
    var audio = new Audio('./sounds/wheel.mp3');
    audio.play();
    var rotorLetter = document.getElementById("rotor" +rotor+ "Current").innerText;
    var next = alphabet.indexOf(rotorLetter);
    var current = (next + 25) % 26;
    var previous = (next + 24) % 26;
    document.getElementById("rotor" +rotor+ "Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor" +rotor+ "Current").innerText = alphabet.charAt(current);
    document.getElementById("rotor" +rotor+ "Next").innerText = rotorLetter;
}

function displayRotorSettings() {
    document.getElementById("rotor1Position").value = document.getElementById("rotor1Current").innerText;
    document.getElementById("rotor2Position").value = document.getElementById("rotor2Current").innerText;
    document.getElementById("rotor3Position").value = document.getElementById("rotor3Current").innerText;
    document.getElementById("rotorSettings").style.display="block";
}

function cancelSettings() {
    document.getElementById("rotorSettings").style.display="none";
}

function caesarShift(str, amount) {
    var output = '';

    for (var i = 0; i < str.length; i ++) {
        var c = str[i];
        var code = str.charCodeAt(i);
        if ((code >= 65) && (code <= 90))
            c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
        output += c;
    }
    return output;
}

function applySettings() {
    //Reflector
    var r = document.getElementById("reflector").value;
    if (r=="UKW-B") {
        reflector = reflectorB;
    } else {
        reflector = reflectorC;
    }
    //rotor and ring
    r = document.getElementById("rotor1Select").value;
    switch(r) {
        case "I": rotorA=rotor1; rotorATrigger = rotor1Trigger; break;
        case "II": rotorA=rotor2; rotorATrigger = rotor2Trigger; break;
        case "III": rotorA=rotor3; rotorATrigger = rotor3Trigger; break;
        case "IV": rotorA=rotor4; rotorATrigger = rotor4Trigger; break;
        case "V": rotorA=rotor5; rotorATrigger = rotor5Trigger; break;
    } 
    document.getElementById("rotorName1").innerText = r;
    r = document.getElementById("rotor2Select").value;
    switch(r) {
        case "I": rotorB=rotor1; rotorBTrigger = rotor1Trigger; break;
        case "II": rotorB=rotor2; rotorBTrigger = rotor2Trigger; break;
        case "III": rotorB=rotor3; rotorBTrigger = rotor3Trigger; break;
        case "IV": rotorB=rotor4; rotorBTrigger = rotor4Trigger; break;
        case "V": rotorB=rotor5; rotorBTrigger = rotor5Trigger; break;
    } 
    document.getElementById("rotorName2").innerText = r;
    r = document.getElementById("rotor3Select").value;
    switch(r) {
        case "I": rotorC=rotor1; rotorCTrigger = rotor1Trigger; break;
        case "II": rotorC=rotor2; rotorCTrigger = rotor2Trigger; break;
        case "III": rotorC=rotor3; rotorCTrigger = rotor3Trigger; break;
        case "IV": rotorC=rotor4; rotorCTrigger = rotor4Trigger; break;
        case "V": rotorC=rotor5; rotorCTrigger = rotor5Trigger; break;
    }
    document.getElementById("rotorName3").innerText = r;
    //initial position
    var rotor3Setting = document.getElementById("rotor3Setting").value;
    var offset3Setting = alphabet.indexOf(rotor3Setting);
    var rotor2Setting = document.getElementById("rotor2Setting").value;
    var offset2Setting = alphabet.indexOf(rotor2Setting);
    var rotor1Setting = document.getElementById("rotor1Setting").value;
    var offset1Setting = alphabet.indexOf(rotor1Setting);

    rotorA = caesarShift(rotorA,offset1Setting);
    rotorB = caesarShift(rotorB,offset2Setting);
    rotorC = caesarShift(rotorC,offset3Setting);
    
    if (offset1Setting>0) rotorA = rotorA.substring(26-offset1Setting) + rotorA.substring(0,26-offset1Setting);
    if (offset2Setting>0) rotorB = rotorB.substring(26-offset2Setting) + rotorB.substring(0,26-offset2Setting);
    if (offset3Setting>0) rotorC = rotorC.substring(26-offset3Setting) + rotorC.substring(0,26-offset3Setting);

    var rotorALetter = document.getElementById("rotor1Position").value;
    var rotorBLetter = document.getElementById("rotor2Position").value;
    var rotorCLetter = document.getElementById("rotor3Position").value;
    
    document.getElementById("rotor1Current").innerText = rotorALetter;
    document.getElementById("rotor2Current").innerText = rotorBLetter;
    document.getElementById("rotor3Current").innerText = rotorCLetter;
    
    var current = alphabet.indexOf(rotorALetter);
    var previous = (current + 25) % 26;
    var next = (current + 1) % 26;
    document.getElementById("rotor1Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor1Next").innerText = alphabet.charAt(next);
    
    current = alphabet.indexOf(rotorBLetter);
    previous = (current + 25) % 26;
    next = (current + 1) % 26;
    document.getElementById("rotor2Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor2Next").innerText = alphabet.charAt(next);
    
    current = alphabet.indexOf(rotorCLetter);
    previous = (current + 25) % 26;
    next = (current + 1) % 26;
    document.getElementById("rotor3Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor3Next").innerText = alphabet.charAt(next);
    
    document.getElementById("rotorSettings").style.display="none";
}

function getFileSettings(){
    //hide rotorSettings
    document.getElementById("rotorSettings").style.display="none";
    //show monthSettings
    document.getElementById("monthSettings").style.display="block";
    //set current month on monthSettings
    var d = new Date();
    document.getElementById("month").innerText = month[d.getMonth()];
}

function closeMonthSettings(){
    document.getElementById("monthSettings").style.display="none";
}

function applyFileSettings(refl, roto, rings, initPos, plugs) {
    //Reflector
    var r = refl;
    if (r=="UKW-B") {
        reflector = reflectorB;
    } else {
        reflector = reflectorC;
    }
    //rotor and ring
    var rot = roto.split(" ");
    r = rot[0];
    switch(r) {
        case "I": rotorA=rotor1; rotorATrigger = rings[0]; break;
        case "II": rotorA=rotor2; rotorATrigger = rings[0]; break;
        case "III": rotorA=rotor3; rotorATrigger = rings[0]; break;
        case "IV": rotorA=rotor4; rotorATrigger = rings[0]; break;
        case "V": rotorA=rotor5; rotorATrigger = rings[0]; break;
    }
    document.getElementById("rotorName1").innerText = r;
    r = rot[1];
    switch(r) {
        case "I": rotorB=rotor1; rotorBTrigger = rings[1]; break;
        case "II": rotorB=rotor2; rotorBTrigger = rings[1]; break;
        case "III": rotorB=rotor3; rotorBTrigger = rings[1]; break;
        case "IV": rotorB=rotor4; rotorBTrigger = rings[1]; break;
        case "V": rotorB=rotor5; rotorBTrigger = rings[1]; break;
    } 
    document.getElementById("rotorName2").innerText = r;
    r = rot[2];
    switch(r) {
        case "I": rotorC=rotor1; rotorCTrigger = rings[2]; break;
        case "II": rotorC=rotor2; rotorCTrigger = rings[2]; break;
        case "III": rotorC=rotor3; rotorCTrigger = rings[2]; break;
        case "IV": rotorC=rotor4; rotorCTrigger = rings[2]; break;
        case "V": rotorC=rotor5; rotorCTrigger = rings[2]; break;
    }
    document.getElementById("rotorName3").innerText = r;
    //initial position
    var rotor3Setting = initPos[2];
    var offset3Setting = alphabet.indexOf(rotor3Setting);
    var rotor2Setting = initPos[1];
    var offset2Setting = alphabet.indexOf(rotor2Setting);
    var rotor1Setting = initPos[0];
    var offset1Setting = alphabet.indexOf(rotor1Setting);
    document.getElementById("rotor1Position").value = initPos[0];
    document.getElementById("rotor2Position").value = initPos[1];
    document.getElementById("rotor3Position").value = initPos[2];

    rotorA = caesarShift(rotorA,offset1Setting);
    rotorB = caesarShift(rotorB,offset2Setting);
    rotorC = caesarShift(rotorC,offset3Setting);
    
    if (offset1Setting>0) rotorA = rotorA.substring(26-offset1Setting) + rotorA.substring(0,26-offset1Setting);
    if (offset2Setting>0) rotorB = rotorB.substring(26-offset2Setting) + rotorB.substring(0,26-offset2Setting);
    if (offset3Setting>0) rotorC = rotorC.substring(26-offset3Setting) + rotorC.substring(0,26-offset3Setting);

    var rotorALetter = document.getElementById("rotor1Position").value;
    var rotorBLetter = document.getElementById("rotor2Position").value;
    var rotorCLetter = document.getElementById("rotor3Position").value;
    
    document.getElementById("rotor1Current").innerText = rotorALetter;
    document.getElementById("rotor2Current").innerText = rotorBLetter;
    document.getElementById("rotor3Current").innerText = rotorCLetter;
    
    var current = alphabet.indexOf(rotorALetter);
    var previous = (current + 25) % 26;
    var next = (current + 1) % 26;
    document.getElementById("rotor1Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor1Next").innerText = alphabet.charAt(next);
    
    current = alphabet.indexOf(rotorBLetter);
    previous = (current + 25) % 26;
    next = (current + 1) % 26;
    document.getElementById("rotor2Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor2Next").innerText = alphabet.charAt(next);
    
    current = alphabet.indexOf(rotorCLetter);
    previous = (current + 25) % 26;
    next = (current + 1) % 26;
    document.getElementById("rotor3Previous").innerText = alphabet.charAt(previous);
    document.getElementById("rotor3Next").innerText = alphabet.charAt(next);
    
    document.getElementById("rotorSettings").style.display="none";

    //plugs
    var pl = plugs.split(" ");
    for(var i=0;i<pl.length;i++){
        var from=pl[i][0];
        var to = pl[i][1];
        var sel = document.getElementsByClassName("plug");
        plug(getElementByLetter(sel, from));
        plug(getElementByLetter(sel, to));
    }
}

function getElementByLetter(sel, letter){
    for(var i = 0; i < sel.length; i++){
        if(sel[i].innerText.toLowerCase() == letter.toLowerCase())
            return sel[i];
    }
    return null;
}

function clearText() {
    if (mode=="Encrypt") {
        document.getElementById("plaintext").innerHTML="<H1>Plaintext:</H1>";
        document.getElementById("ciphertext").innerHTML="<H1>Ciphertext:</H1>";
    } else {
        document.getElementById("plaintext").innerHTML="<H1>Ciphertext:</H1>";
        document.getElementById("ciphertext").innerHTML="<H1>Plaintext:</H1>"; 
    } 
    letterCount =0;
    clearLog();
}

function encrypt() {
    mode="Encrypt";
    document.getElementById("enigma-book").className="page1";
    clearText();
}

function decrypt() {
    mode="Decrypt";
    document.getElementById("enigma-book").className="page2";
    clearText();
}

//Marry Cohen: https://math.stackexchange.com/questions/3557767/how-to-construct-a-catenary-of-a-specified-length-through-two-specified-points
function catenary(x1, y1, x2, y2, rLen)
{
    if (x2 < x1) {
        var tmp;
        tmp = x2 ; x2 = x1 ; x1 = tmp;
        tmp = y2 ; y2 = y1 ; y1 = tmp;
    }
    var dx = x2 - x1;
    var xavg = (x1 + x2) / 2;
    var dy = y2 - y1;
    var yavg = (y1 + y2) / 2;
    if (rLen * rLen < dx * dx + dy * dy) return [];
    var r = Math.sqrt(rLen * rLen - dy * dy) / dx;
    var A = CalcA(r);
    var a = -dx / (2 * A);//change sign to reverse Y-axis [previous:  a = dx / (2 * A)]
    var b = xavg - a * 0.5 * Math.log((1 + dy / rLen) / (1 - dy / rLen));
    var c = yavg + rLen / (2 * Math.tanh(A));//change sign to reverse Y-axis [previous: c = yavg - rLen / (2 * Math.Tanh(A))]
    var points = [];
    for (var x = x1; x <= x2; x += 5.0){
        points.push(new Point(x, (a * Math.cosh((x - b) / a) + c)));
    }
    return points;
}

function CalcA(r)
{
    var A = r < 3 ? Math.sqrt(6 * (r - 1)) : Math.log(2 * r) + Math.log(Math.log(2 * r));
    while (Math.abs(r - Math.sinh(A) / A) > ropePrecision){
        A = A - (Math.sinh(A) - r * A) / (Math.cosh(A) - r);
    }
    return A;
}

//applyZoom(0.6);

// function enigmaWindow() {
//     window.open("./enigma-M3.html",'_blank','toolbar=no, menubar=no, location=no, resizable=yes, addressbar=no,  width=800, height=600');
// }
// function enigmaInstructions() {
//     window.open("./insideEnigma.html",'_blank','toolbar=no, menubar=no, location=no, resizable=yes, addressbar=no,  width=860, height=600');
// }

//when 'Inside Enigma' (top-right) is clicked
document.getElementById("insideEnigma").addEventListener("click", function(e){
    var div=document.getElementById("insideEnigmaTab");
    div.style.display="block";
});

//check if we click outside 'insideEnigma' to close this div
document.addEventListener("mouseup", function(e){
    if(document.getElementById('insideEnigmaTab').style.display!="none"){
        if (!document.getElementById('insideEnigmaTab').contains(e.target) && document.getElementById('insideEnigmaTab')!=e.target){
            e.stopPropagation();
            document.getElementById('insideEnigmaTab').style.display="none";
        }
    }
});

document.getElementById("monthSettings").addEventListener("click", (e)=>{
    if(e.y<=zoom*143 || e.y>zoom*743 || e.x<zoom*179 || e.x>577*zoom)return;
    document.getElementById("monthSettings").style.display="none";
    var y0 = zoom*143-window.scrollY;
    var yn = zoom*743-window.scrollY;
    var line = Math.ceil((e.y - y0)/(20*zoom)) - 1;
    console.log("line="+line);
    var sett = appSettings[line];
    if(sett!=undefined){
        var elements = document.getElementsByClassName("plug");
        jg.clear();
        for(var i = 0; i < elements.length; i++)
            resetPlug(elements[i].style.background);
        applyFileSettings("UKW-B", sett.rotor, sett.rings, sett.initPos, sett.plugs);
    }else{
        alert("Cannot retrieve Settings....\r\nUsing the last settings.");
    }
});

function closeInsideEnigma(){
    var div=document.getElementById("insideEnigmaTab");
    div.style.display="none";
}