// let rcmMenu = document.createElement("table");
// rcmMenu.id = "rcmMenu";
// //document.children[0].children[1].appendChild(rcmMenu);
// canvas.elt.appendChild(rcmMenu);

// canvas.elt.addEventListener("contextmenu", function (e) {
//     rcm.data = [];

//     let tempEvent = e.target;
//     let tempAttributes = {};

//     while (tempEvent.parentElement !== null) {
//         for (let i = 0; i < tempEvent.attributes.length; i++) {
//             if (!tempAttributes[tempEvent.attributes.item(i).name]) {
//                 tempAttributes[tempEvent.attributes.item(i).name] = [];
//             }
//             tempAttributes[tempEvent.attributes.item(i).name].push.apply(
//                 tempAttributes[tempEvent.attributes.item(i).name],
//                 tempEvent.attributes.item(i).value.split(" ")
//             );
//         }
//         tempEvent = tempEvent.parentElement;
//     } //gets all properties

//     if (rcmMenu.offsetHeight + e.pageY >= window.innerHeight) {
//         rcmMenu.style.top = e.pageY - rcmMenu.offsetHeight + "px";
//     } else {
//         rcmMenu.style.top = e.pageY + "px";
//     }
//     if (rcmMenu.offsetWidth + e.pageX >= window.innerWidth) {
//         rcmMenu.style.left = e.pageX - rcmMenu.offsetWidth + "px";
//     } else {
//         rcmMenu.style.left = e.pageX + "px";
//     }

//     try {
//         rcm.execRules(tempAttributes);
//     } catch (error) {console.log(error)}
//     if (rcm.data.length == 0) {
//         rcmMenu.style.top = "-20px";
//         rcmMenu.style.left = "-20px";
//     }

//     rcmMenu.innerHTML = "";
//     for (let i = 0; i < rcm.data.length; i++) {
//         rcmMenu.innerHTML +=
//         "<td><tr><a href='#' onclick='rcm.data[" +
//         i +
//         "].func("+tempAttributes+");event.preventDefault();'>" +
//         rcm.data[i].name +
//         "</a></td></tr>";
//     }

//     e.preventDefault();
// });


// document.addEventListener("click", function (e) {
//     let tempEvent = e.target;

//     while (tempEvent.parentElement !== null) {
//         if (tempEvent.id == "rcmMenu") return;
//         tempEvent = tempEvent.parentElement;
//     } //gets all properties

//     rcmMenu.innerHTML = "";
//     rcmMenu.style.top = "-20px";
//     rcmMenu.style.left = "-20px";
// });

let rcm = {
    data: [],
    funcRules: {},
    complexFuncRules: [],

    addRule: function (type, value, func) {
        if (!this.funcRules[type.toString()]) {
            this.funcRules[type.toString()] = {};
        }
        this.funcRules[type.toString()][value.toString()] = func;
    },
    addComplexRule: function (condition, func) {
        this.complexFuncRules.push({ condition: condition, func: func });
    },
    addEntry: function (pos, name, func) {
        this.data.splice(pos, 0, {
        name: name,
        func: function () {
            func();
            rcmMenu.innerHTML = "";
            rcmMenu.style.top = "-20px";
            rcmMenu.style.left = "-20px";
        },
        });
    },
    removeEntry: function (pos, name, func) {
        this.data.splice(pos, 1);
    },

    execRules: function (attributes) {
        Object.entries(attributes).forEach(function ([key, value]) {
        if (rcm.funcRules[key]) {
            for (let i = 0; i < value.length; i++) {
                if (rcm.funcRules[key][value[i]]) {
                    rcm.funcRules[key][value[i]]();
                }
            }
        }
        });
        for (let i = 0; i < rcm.complexFuncRules.length; i++) {
            if (rcm.complexFuncRules[i].condition(attributes)) {
                rcm.complexFuncRules[i].func();
            }
        }
    },
};

rcm.addRule("class", "deletable", function () {
    rcm.addEntry(0, "Delete", function () {
        console.log("Deleted!");
    });
});

// rcm.addComplexRule(//copy
//     function () {
//         if (window.getSelection) {
//             return window.getSelection().toString() != "";
//         } else if (document.selection && document.selection.type != "Control") {
//             return document.selection.createRange().text != "";
//         }
//         return false;
//     },
//     function () {
//         rcm.addEntry(0, "Copy", function () {
//             let text = "";
//             if (window.getSelection) {
//                 text = window.getSelection().toString();
//             } else if (document.selection && document.selection.type != "Control") {
//                 text = document.selection.createRange().text;
//             }

//             navigator.clipboard.write([
//                 new ClipboardItem({
//                     ["text/plain"]: new Blob([text], { type: "text/plain" }),
//                 }),
//             ]);
//             console.log("copied " + text);
//         });
//     }
// );