String.prototype.Trim = function ()
{
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.Clean = function ()
{
	return this.Trim().replace(/\s+/g, " ");
}

String.prototype.Strip = function ()
{
	return this.Trim().replace(/\s+/g, "");
}

String.prototype.Contains = function (s, b)
{
	return (b) ? (b + this + b).indexOf(b + s + b) > -1 : this.indexOf(s) > -1;
}

String.prototype.Enclose = function (c)
{
	return c + this + c;
}

String.prototype.ReplaceAt = function (i, c)
{
	if (i < 0 || this.length - 1 < i)
		return this;
	return this.substr(0, i) + c + this.substr(i + 1);
}

function Append(name, into, properpies, style)
{
	var o = document.createElement(name);
	if (properpies != null)
		AddProperties(o, properpies);
	if (style != null)
		AddProperties(o.style, style);
	into.appendChild(o);
	return o;
}

function AppendText(text, into)
{
	var o = document.createTextNode(text);
	into.appendChild(o);
	return o;
}

function Insert(name, into, before, properpies, style)
{
	var o = document.createElement(name);
	if (properpies != null)
		AddProperties(o, properpies);
	if (style != null)
		AddProperties(o.style, style);
	into.insertBefore(o, before);
	return o;
}

function AddProperties(o, properpies)
{
	var pairs = properpies.split(";");
	if (pairs.length == 0)
		return;
	for (var i = 0; i < pairs.length; i++)
	{
		if (pairs[i] == "")
			continue;
		var pair = pairs[i].split(":");
		if (pair.length < 2)
			pair = pairs[i].split("=");
		if (pair.length < 2)
			return;
		o[pair[0].Trim()] = pair[1].Trim();
	}
}

function GetPropArray(o)
{
	var s = "[";
	for (var p in o)
		if (typeof o[p] != "function")
			s += o[p] + ", ";
	s = s.substr(0, s.length - 2);
	s += "]";
	return s;
}

function Copy(o)
{
	var copy = Object.create(Object.getPrototypeOf(o));
	var propNames = Object.getOwnPropertyNames(o);
	propNames.forEach(function(name)
	{
		var desc = Object.getOwnPropertyDescriptor(o, name);
		Object.defineProperty(copy, name, desc);
	});
	return copy;
}


function Get(el)
{
	return document.getElementById(el) || null;
}

function ToggleBlock(id)
{
	var o = document.getElementById(id);
	with (o.style)
		display = (display == "block" ? "none" : "block");
}


function Clear(control)
{
	var o = typeof control !== "undefined" ? control : document.body;
	var children = o.childNodes;
	while (o.childNodes.length > 0)
		o.removeChild(o.firstChild);
}

function ToggleDiv(e)
{
	var id = e.target.target;
	if (id == null)
		return;
	var d = document.getElementById(id);
	if (d == null)
		return;
	d.style.display = d.style.display == 'block' ? 'none' : 'block';
	e.target.innerHTML = d.style.display == 'block' ? "&nbsp Hide" : "&nbsp Show";
}

function MoverTimer(target, destination, dstId, duration, task, thisArg, pawnPromotion)
{
	if (!(this && this instanceof MoverTimer))
		return;
	if (arguments.length < 2)
		throw new TypeError("MoverTimer - not enough arguments");
	this.target = target;
	if (destination.x == undefined || destination.y == undefined)
		throw new TypeError("MoverTimer - destination must be { x:x, y:y } ");
	this.destination = destination;
	this.dstId = dstId;
	this.duration = 1000;
	if (!isNaN(duration) && duration > 10)
		this.duration = Math.floor(duration);
	this.task = task;

	this.timerId = -1;
	this.style = target.style;
	var
		x = this.style.left,
		y = this.style.top,
		p = x.indexOf('p');
	x = Number(x.substr(0, p));
	p = y.indexOf('p');
	y = Number(y.substr(0, p));
		
	this.dx = 10 * (destination.x - x) / this.duration;
	this.dy = 10 * (destination.y - y) / this.duration;
	this.stop = false;
	
	this.OnTick = function (o)
	{
		o.duration -= 10;
		this.stop = o.duration < 10;
		
		if (this.stop)
		{
			o.style.left = o.destination.x + "px";
			o.style.top = o.destination.y + "px";
			o.target.id = o.dstId;
			o.task.call(thisArg, pawnPromotion);
			clearInterval(o.timerId);
		}
		else
		{
			o.style.left = (x += o.dx) + "px";
			o.style.top = (y += o.dy) + "px";
		}
		return !this.stop;
	};
	this.timerId = setInterval(this.OnTick, 10, this);
}

//from Dave Burton https://stackoverflow.com/questions/36921947/read-a-server-side-file-using-javascript
//
// Synchronously read a text file from the web server with Ajax
//
// The filePath is relative to the web page folder.
// Example:   myStuff = loadFile("Chuuk_data.txt");
//
// You can also pass a full URL, like http://sealevel.info/Chuuk1_data.json, but there
// might be Access-Control-Allow-Origin issues. I found it works okay in Firefox, Edge,
// or Opera, and works in IE 11 if the server is configured properly, but in Chrome it only
// works if the domains exactly match (and note that "xyz.com" & "www.xyz.com" don't match).
// Otherwise Chrome reports an error:
//
//   No 'Access-Control-Allow-Origin' header is present on the requested resource. 
//	 Origin 'http://sealevel.info' is therefore not allowed access.
//
// That happens even when "Access-Control-Allow-Origin *" is configured in .htaccess,
// and even though I verified the headers returned (you can use a header-checker site like
// http://www.webconfs.com/http-header-check.php to check it). I think it's a Chrome bug.
function loadFile(filePath){
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.status==200) {
		result = xmlhttp.responseText;
	}
	return result;
}

function formatDate(d){
	var ss = d.split('.');
	return ss[2]+"/"+ss[1]+"/"+ss[0];
}
