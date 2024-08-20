var star = new Image();
var earth = new Image();
var ship = new Image();
var background = new Image();

star.src = './star.png';
earth.src = './earth.png';
ship.src = './ship.png';
background.src = './space2.jpg';

var travelType = 0;

var destinations=[
    {position:"A Centuri",distance:4.3, back:'./space1.jpg', target:'./star.png'},
    {position:"EQ Pegasi", distance:20.43, back:'./space2.jpg', target:'./star.png'},
    {position:"Beta Hydri", distance:24.33, back:'./space1.jpg', target:'./star.png'},
    {position:"Vega", distance:27, back:'./space3.jpg', target:'./star.png'},
    {position:"Tau Eridani", distance:45.6, back:'./space2.jpg', target:'./star.png'},
    {position:"Eta Leporis", distance:49.1, back:'./space1.jpg', target:'./star.png'},
    {position:"Betelgeuse", distance:550, back:'./galaxies1.jpg', target:'./star.png'},
    {position:"Eta Canis Majoris", distance:2000, back:'./galaxies3.jpg', target:'./star.png'},
    {position:"Center of Milky Way",distance:30000, back:'./milkyway.jpg', target:'./blackhole.png'},
    {position:"Small Magellanic Cloud", distance:200000, back:'./galaxies3.jpg', target:'./galaxy2.png'},
    {position:"Andromeda Galaxy", distance:2500000, back:'./galaxies2.jpg', target:'./galaxy3.png'},
];

