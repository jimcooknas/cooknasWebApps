
function createStyles(side){
    var st="";
    /* css for SlidingPanel */
    st += "#menu__toggle {";
    st += "    opacity: 0;";
    st += " }";
    st += "#menu__toggle:checked + .menu__btn > span {";
    if(side=="left")st += "    transform: translate(140px, 0px) rotate(45deg);";/*comment this line and uncomment next for sliding right*/
    else st += "    transform: rotate(45deg);";
    st += " }";
    st += "#menu__toggle:checked + .menu__btn > span::before {";
    st += "    top: 0;";
    st += "    transform: rotate(0deg);";
    st += "}";
    st += "#menu__toggle:checked + .menu__btn > span::after {";
    st += "    top: 0;";
    st += "    transform: rotate(90deg);";
    st += "}";
    st += "#menu__toggle:checked ~ .menu__box {";
    if(side=="left")st += "    left: 0 !important;";/*comment this line and uncomment next for sliding right*/
    else st += "    right: 0 !important;";
    st += "}";
    st += ".menu__btn {";
    st += "    position: fixed;";
    st += "    top: 28px;";
    if(side=="left")st += "    left: 20px;";/*comment this line and uncomment next for sliding right*/
    else st += "    right: 20px;";
    st += "    width: 26px;";
    st += "    height: 26px;";
    st += "    cursor: pointer;";
    st += "    z-index: 1;";
    st += "}";
    st += ".menu__btn > span,";
    st += ".menu__btn > span::before,";
    st += ".menu__btn > span::after {";
    st += "    display: block;";
    st += "    position: absolute;";
    st += "    width: 100%;";
    st += "    height: 6px;";
    st += "    background-color: #bbbbbb;";/*#616161;*/
    st += "    transition-duration: .35s;";
    st += "}";
    st += ".menu__btn > span::before {";
    st += "    content: '';";
    st += "    top: -8px;";
    st += " }";
    st += ".menu__btn > span::after {";
    st += "    content: '';";
    st += "    top: 8px;";
    st += "}";
    st += ".menu__box {";
    st += "    display: block;";
    st += "    position: fixed;";
    st += "    top: 10px;";
    if(side=="left")st += "    left: -100%;";/*comment this line and uncomment next for sliding right*/
    else st += "    right: -100%;";
    st += "    width: 200px;";
    st += "    height: 85%;";
    st += "    margin: 0;";
    st += "    padding: 40px 0;";
    if(side=="left")st += "    border-radius: 0px 8px 8px 0px;";
    else st += "    border-radius: 8px 0px 0px 8px;";
    st += "    list-style: none;";
    st += "    /*overflow-y:scroll;*/";
    st += "    background-color: #333355cc;";
    st += "    box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);";
    st += "    transition-duration: .25s;";
    st += "}";
    st += ".menu__item {";
    st += "    display: block;";
    st += "    padding: 4px 4px;";
    st += "    color: #fff;";
    st += "    font-family: 'Roboto', sans-serif;";
    st += "    font-size: 14px;";
    st += "    font-weight: 100;";
    st += "    text-decoration: none;";
    st += "    transition-duration: .25s;";
    st += "}";
    st += ".menu__item:hover {";
    st += "    background-color: #CFD8DC;";
    st += "    color:black;";
    st += "}";
    /* end of css for SlidingPanel */
    /* elements inside SlidingPanel */
    st += ".menu__center{";
    st += "    overflow: hidden;";
    st += "    margin:8px auto;";
    st += "    padding: 8px 8px;";
    st += "}";
    st += ".menu__center__center{";
    st += "    padding: 8px;";
    st += "    display: -webkit-box;";
    st += "    display: -moz-box;";
    st += "    display: -ms-flexbox;";
    st += "    display: -webkit-flex;";
    st += "    display: flex;";
    st += "    -webkit-box-align : center;";
    st += "    -moz-box-align: center;";
    st += "    -ms-flex-align: center;";
    st += "    -webkit-align-items: center;";
    st += "    align-items: center;";
    st += "    justify-content: center;";
    st += "    -webkit-justify-content: center;";
    st += "    -webkit-box-pack: center;";
    st += "    -moz-box-pack: center;";
    st += "    -ms-flex-pack: center;";
    st += "}";
    st += ".menu__title{";
    st += "    font-size:18px;";
    st += "    font-weight: bold;";
    st += "    background-color: #9898aC;";
    st += "    color:black;";
    st += "}";
    st += ".menu__unhover:hover{";
    st += "    background-color: transparent;";
    st += "    color:white;";
    st += "}";
    st += ".menu__button{";
    st += "     font-size:14px;";
    st += "     font-weight:bold;";
    st += "     border-radius: 6px;";
    st += "     background-color: #333377;";
    st += "     color:white;";
    st += "     margin:auto;";
    st += "     padding:8px;";
    st += "}";
    st += ".menu__button:hover{"
    st += "     background-color: #ccccff;"
    st += "     color:black;";
    st += "}";
    st += "input[type='text']{";
    st += "     max-width:50%;";
    st += "     margin:4px;";
    st += "}";
    st += ".menu__label{";
    st += "     max-width:50%;";
    st += "     float: left;";
    st += "     padding: 4px 4px;";
    st += "}";
    st += ".menu__text{";
    st += "     max-width:50%;";
    st += "     float: right;";
    st += "     padding: 0px 4px;";
    st += "}";
    /* end of elements inside SlidingPanel */

    var styleCss = document.createElement("style");
    styleCss.textContent = st;
    document.head.appendChild(styleCss);
    return styleCss;
}


/**
 * Creates a new element and appends it to the panel
 * @param {string} elType - the type of element. This can be also an input element in wchich case must be followed by input type
 * @param {string} elId - the id of the created element (it could be empty)
 * @param {string} elParent - the id of element's parent. If it is empty then the parent is directly the panel
 * @param {string} elContent - the content of the element (it could be empty)
 * @param {string} elClass - the list of element classes (classes' names are separated by space)
 * @returns {element} creates the element but also returns it
 */
function addPanelElement(elType, elId, elParent, elContent, elClass){
    var el;
    var elm = elType.split(" ");
    if(elm.length==1){
        el = document.createElement(elm[0]);
    }else{
        el = document.createElement(elm[0]);
        el.type = elm[1];
    }
    if(elId!="")el.id = elId;
    if(elContent!="")el.textContent = elContent;
    if(elClass!=""){
        var cl = elClass.split(" ");
        for(var i=0;i<cl.length;i++)
            el.classList.add(cl[i]);
    }
    if(elParent=="")
        this.innerPanel.appendChild(el);
    else 
        document.getElementById(elParent).appendChild(el);
    return el;
}