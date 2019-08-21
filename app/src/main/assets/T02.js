var coords = [];
var index = [];
var anglex=0, angley=0, anglez=0;
var dist = 1000;

class vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class triangle {
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, n, angle) {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;

        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;

        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;

        this.n = n;
        this.angle = angle;
    }
}

function compareNumeric(a, b) {
    if (a.z1 > b.z1) return 1;
    if (a.z1 == b.z1) return 0;
    if (a.z1 < b.z1) return -1;
  }  

function Normals(C, B, A) {
    vx1 = A.x - B.x;
    vy1 = A.y - B.y;
    vz1 = A.z - B.z;
    vx2 = B.x - C.x;
    vy2 = B.y - C.y;
    vz2 = B.z - C.z;
    Nx = vy1 * vz2 - vz1 * vy2;
    //console.log(Nx);
    Ny = vz1 * vx2 - vx1 * vz2;
    Nz = vx1 * vy2 - vy1 * vx2;
    //len = Math.sqrt(((vy1*vz2-vz1*vy2)^2+(vz1*vx2-vx1*vz2)^2+(vx1*vy2-vy1*vx2)^2));
    len = Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz);
    //console.log(len);
    Nx = Nx / len; 
    Ny = Ny / len;
    Nz = Nz / len;
    //console.log(Nx);
    var res = new vertex(Nx, Ny, Nz);
    return res;
}

function light(norm, vec) {
    len1 = Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
    len = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    angle = (norm.x * vec.x + norm.y * vec.y + norm.z * vec.z)/(len1 * len);
    //console.log(len);
    //console.log(len1);
    return angle;
}

function Draw(id)
{
    var canvas = document.getElementById(id); 
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var finalc = [];
    var normals = [];
    var center = [];
    var angles = [];
    var triangles = [];
    for (i=0;i<index.length;i+=3) {
        a1 = index[i];
        a2 = index[i+1];
        a3 = index[i+2];
        var norm = Normals(coords[a1], coords[a2], coords[a3]);
        
        //console.log(triangles);
        x = (coords[a1].x + coords[a2].x + coords[a3].x) / 3;
        y = (coords[a1].y + coords[a2].y + coords[a3].y) / 3;
        z = (coords[a1].z + coords[a2].z + coords[a3].z) / 3;
        normals.push(new vertex(norm.x + x, norm.y + y, norm.z + z));
        center.push(new vertex(x, y, z));
        angles.push(light(new vertex(norm.x, norm.y, norm.z), new vertex(0,0,1)));
        abgle = light(norm, new vertex(0,0,1));
        triangles.push(new triangle(coords[a1].x, coords[a1].y, coords[a1].z, coords[a2].x, coords[a2].y, coords[a2].z, coords[a3].x, coords[a3].y, coords[a3].z, norm, abgle));
        //console.log(abgle);
        
    }
    //console.log(angles);
    //console.log(triangles[0].x1);
    triangles.sort(compareNumeric);

    /*for (i=0; i<coords.length;i++) {
        tempz = 600/(dist+coords[i].z);
        x = coords[i].x * tempz + 300;
        y = coords[i].y * tempz + 300;
        //console.log(y);
        finalc.push(new vertex(x, y, 0));
    }*/

    for (i=0; i<triangles.length;i++) {
        tempz = 600/(dist+triangles[i].z1);
        x = triangles[i].x1 * tempz + 300;
        y = triangles[i].y1 * tempz + 300;
        //finalc.push(new vertex(x, y, 0));
        triangles[i].x1 = x;
        triangles[i].y1 = y;
        //console.log(triangles[i].z1);

        tempz = 600/(dist+triangles[i].z2);
        x = triangles[i].x2 * tempz + 300;
        y = triangles[i].y2 * tempz + 300;
        //finalc.push(new vertex(x, y, 0));
        triangles[i].x2 = x;
        triangles[i].y2 = y;

        tempz = 600/(dist+triangles[i].z3);
        x = triangles[i].x3 * tempz + 300;
        y = triangles[i].y3 * tempz + 300;
        //finalc.push(new vertex(x, y, 0));
        triangles[i].x3 = x;
        triangles[i].y3 = y;
		console.log(triangles[i].n);
    }

    /*for (i=0;i<normals.length;i++) {
        ntempz = 600/(dist+normals[i].z);

        nx = normals[i].x * ntempz + 300;
        ny = normals[i].y * ntempz + 300;

        ctempz = 600/(dist+center[i].z);
        
        cx = center[i].x * ctempz + 300;
        cy = center[i].y * ctempz + 300;
        //ctx.moveTo(cx, cy);
        //ctx.lineTo(nx, ny);
        //normals[i].x = nx;
        //normals[i].y = ny;
        //normals[i].z = ntempz;
        //angles.push(light(normals[i], new vertex(0,0,1)));
        //console.log(ntempz);
        //ctx.rect(nx, ny, 1, 1);
    }*/
    //console.log(normals.length);

    j = 0;
    for (i=0;i<triangles.length;i++) {
        //if (angles[i] > 0) {
            ctx.beginPath();
            red = 255;
            green = 0;
            blue = 0;
            red *= triangles[i].angle;//angles[i];
            ctx.fillStyle = 'rgb('+ red +','+ green +','+ blue +')';
            ctx.strokeStyle = 'rgb('+ red +','+ green +','+ blue +')';
            ctx.moveTo(triangles[i].x1, triangles[i].y1);
            ctx.lineTo(triangles[i].x2, triangles[i].y2);
            ctx.lineTo(triangles[i].x3, triangles[i].y3);
            ctx.lineTo(triangles[i].x1, triangles[i].y1);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
        //}
    }
    /*for (i=0;i<index.length;i+=3) {
        a1 = index[i];
        a2 = index[i+1];
        a3 = index[i+2];
        if (angles[j] > 0) {
            ctx.beginPath();
            red = 255;
            green = 0;
            blue = 0;
            red *= angles[j];
            ctx.fillStyle = 'rgb('+ red +','+ green +','+ blue +')';
            ctx.strokeStyle = 'rgb('+ red +','+ green +','+ blue +')';
            ctx.moveTo(finalc[a1].x, finalc[a1].y);
            ctx.lineTo(finalc[a2].x, finalc[a2].y);
            ctx.lineTo(finalc[a3].x, finalc[a3].y);
            ctx.lineTo(finalc[a1].x, finalc[a1].y);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
        }
        j++;
    }*/
    //ctx.rect(300, 300, 1, 1);
}

function btnTest2_Click()
{
  var canvas = document.getElementById("canvas"); 
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function btnTest1_Click()
{
    Draw("canvas");   
}

function testMy() {
    anglex = document.getElementById("line").value;
    my = document.getElementById("my");
    my.innerHTML =anglex;
    anglex *= Math.PI / 180;
    rotatex();
    Draw("canvas");
   }

function testMy1() {
    angley = document.getElementById("line1").value;
    my = document.getElementById("my1");
    my.innerHTML =angley;
    angley *= Math.PI / 180;
    rotatey();
    Draw("canvas");
   }

function testMy2() {
    anglez = document.getElementById("line2").value;
    my = document.getElementById("my2");
    my.innerHTML =anglez;
    anglez *= Math.PI / 180;
    rotatez();
    Draw("canvas");
   }

function testMy3() {
    dist = document.getElementById("line3").value * 30;
    my = document.getElementById("my3");
    my.innerHTML =dist;
    Draw("canvas");
   }

function rotatex() {
    canvas.width = canvas.height;
    for (i=0; i<coords.length;i++) {
        z = -coords[i].y*Math.sin(anglex) + coords[i].z*Math.cos(anglex);
        y = coords[i].y * Math.cos(anglex) + coords[i].z*Math.sin(anglex);
        coords[i].z = z;
        coords[i].y = y;
    }
}
  
function rotatey() {
    canvas.width = canvas.height;
    for (i=0; i<coords.length;i++) {
        z = -coords[i].x*Math.sin(angley) + coords[i].z*Math.cos(angley);
        x = coords[i].x * Math.cos(angley) + coords[i].z*Math.sin(angley);
        coords[i].x = x;
        coords[i].z = z;
    }
}

function rotatez() {
    canvas.width = canvas.height;
    for (i=0; i<coords.length;i++) {
        y = -coords[i].x*Math.sin(anglez) + coords[i].y*Math.cos(anglez);
        x = coords[i].x * Math.cos(anglez) + coords[i].y*Math.sin(anglez);
        coords[i].y = y;
        coords[i].x = x;
    }
}

function readV()
{
  var file = document.getElementById("file").files[0]
  var reader = new FileReader()
  var buffer = 0;
  reader.onload = function() 
  {
    console.log("File readed!")
    //document.getElementById("out").innerHTML=reader.result
    buffer = reader.result;
    //coords = 0;
    var view = 0;
    console.log(buffer.byteLength);
    view = new Int32Array(buffer);
    while(coords.length>0)
      coords.pop();
    for (i=0; i < view.length; i+=4) {
      coords.push(new vertex(view[i+1]/100, view[i+2]/100, view[i+3]/100));
    }
    //finalc = coords.slice();
    console.log(view[0]);
  }
  reader.readAsArrayBuffer(file);
}

function readT()
{
    console.log("Ky");
    var file = document.getElementById("file").files[0];
    var reader = new FileReader()
    var buffer = 0;
    var view = 0;
    reader.onload = function() 
    {
        console.log("File readed!");
        buffer = reader.result;
        console.log(buffer.byteLength);
        view = new Int32Array(buffer);
        while(coords.length>0)
        coords.pop();
        var j = 0;
        for (i=0; i < view.length; i+=4) {
            index[j] = view[i+1];
            j++;
            index[j] = view[i+2];
            j++;
            index[j] = view[i+3];
            j++;
        }
        //for (i=0; i<index.length;i++)
            //console.log(index[i]);
    }
    reader.readAsArrayBuffer(file);
}