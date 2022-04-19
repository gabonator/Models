var radius = 30;
var height = 50;
var points = 200;
var waves = 14;
var data = [];
for (var y=0; y<height; y++)
{
  data.push([]);
  for (var x=0; x<points; x++)
  {
    var alpha = x/points*Math.PI*2;
    var beta = x/points*waves*Math.PI*2;
//    var r = radius + Math.cos(beta+y*0.05)*Math.abs(Math.cos(y/10*Math.PI*2))*2;
//    var r = radius;
    var r = radius*(0.7+0.5*Math.sin(y/height*90/180*Math.PI)) + Math.cos(beta+y*0.08)*Math.cos(y/8*Math.PI*2)*1;
    var point = {x:Math.cos(alpha)*r, y:Math.sin(alpha)*r, z:y/2};
    data[y].push(point);
  }
}

var buffer = [];
function addByte(n)
{
  var b = new Buffer.alloc(1);
  b.writeUInt8(n, 0);
  buffer.push(b);
}

function addDword(n)
{
  var b = new Buffer.alloc(4);
  b.writeUInt32LE(n, 0);
  buffer.push(b);
}

function addReal(n)
{
  var b = new Buffer.alloc(4);
  b.writeFloatLE(n, 0);
  buffer.push(b);
}

for (var i=0; i<80; i++)
  addByte(0);
addDword((height-1)*points*2);

function addTriangle(p1, p2, p3)
{
  var pts = [{x:0, y:0, z:0}, p1, p2, p3];
  for (var i=0; i<pts.length; i++)
  {
    addReal(pts[i].x);
    addReal(pts[i].y);
    addReal(pts[i].z);
  }
  addByte(0);
  addByte(0);
}

for (var y=0; y<height-1; y++)
  for (var x=0; x<points; x++)
  {
    var p1 = data[y][x];
    var p2 = data[y][(x+1)%points];
    var p3 = data[y+1][x];
    var p4 = data[y+1][(x+1)%points];

    addTriangle(p1, p2, p3)
    addTriangle(p3, p4, p2)
  }
console.log(buffer);
//console.log(Buffer.from(buffer));

var fs = require("fs");
fs.writeFileSync("model.stl", Buffer.concat(buffer));