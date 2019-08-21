"use strict";
document.addEventListener("DOMContentLoaded", () => {

    // Set Event hamdlers
    const btnMain = document.getElementById("btnTest1"),
        btnRead = document.getElementById("bt1");

        // btnMain.addEventListener("click", e => {
        //     main();
        // });
        // btnRead.addEventListener("click", e => {
        //     readFile();
        // });

        document.body.addEventListener("click", e=>{
            console.log(" body click");

            if(!e.target){
                return;
            }
            
            if(e.target.matches("#btnTest1")){
                main();
            }else  if(e.target.matches("#bt1")){
                readFile();
            }
            
        });


});
var ar = [];
var lines = [];

function main() {
console.log("Main");
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var normalLocation = gl.getAttribLocation(program, "a_normal");
    var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    setNormals(gl);

    function radToDeg(r) {
        return r * 180 / Math.PI;
    }

    function degToRad(d) {
        return d * Math.PI / 180;
    }

    var fieldOfViewRadians = degToRad(60);
    var translation = [0, 0, 0];
    var rotation = [degToRad(0), degToRad(0), degToRad(0)];
    var scale = [1, 1, 1];


    drawScene();

    webglLessonsUI.setupSlider("#x", {
        value: translation[0],
        slide: updatePosition(0),
        min: -700,
        max: gl.canvas.width
    });
    webglLessonsUI.setupSlider("#y", {
        value: translation[1],
        slide: updatePosition(1),
        min: -700,
        max: gl.canvas.height
    });
    webglLessonsUI.setupSlider("#z", {
        value: translation[2],
        slide: updatePosition(2),
        min: -700,
        max: gl.canvas.height
    });
    webglLessonsUI.setupSlider("#angleX", {
        value: radToDeg(rotation[0]),
        slide: updateRotation(0),
        max: 360
    });
    webglLessonsUI.setupSlider("#angleY", {
        value: radToDeg(rotation[1]),
        slide: updateRotation(1),
        max: 360
    });
    webglLessonsUI.setupSlider("#angleZ", {
        value: radToDeg(rotation[2]),
        slide: updateRotation(2),
        max: 360
    });
    webglLessonsUI.setupSlider("#scaleX", {
        value: scale[0],
        slide: updateScale(0),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2
    });
    webglLessonsUI.setupSlider("#scaleY", {
        value: scale[1],
        slide: updateScale(1),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2
    });
    webglLessonsUI.setupSlider("#scaleZ", {
        value: scale[2],
        slide: updateScale(2),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2
    });

    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateRotation(index) {
        return function (event, ui) {
            var angleInDegrees = ui.value;
            var angleInRadians = angleInDegrees * Math.PI / 180;
            rotation[index] = angleInRadians;
            drawScene();
        };
    }

    function updateScale(index) {
        return function (event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 1;
        var zFar = 2000;
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
        var camera = [0, 0, 1600];
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        var cameraMatrix = m4.lookAt(camera, target, up);
        var viewMatrix = m4.inverse(cameraMatrix);
        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
        var worldMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        worldMatrix = m4.scale(worldMatrix, scale[0], scale[1], scale[2]);
        worldMatrix = m4.translate(worldMatrix, translation[0], translation[1], translation[2]);
        worldMatrix = m4.xRotate(worldMatrix, rotation[0]);
        worldMatrix = m4.yRotate(worldMatrix, rotation[1]);
        worldMatrix = m4.zRotate(worldMatrix, rotation[2]);
        var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
        var worldInverseMatrix = m4.inverse(worldMatrix);
        var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);
        gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
        gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
        gl.uniform4fv(colorLocation, [0.2, 0.2, 0.2, 1]);
        gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0, 0, -1]));
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 1.5 * ar.length;
        gl.drawArrays(gl.TRIANGLES, 0, count);
    }
}

function setGeometry(gl) {
    const t = new Float32Array(4 * lines.length);
    var j = 0;
    for (var i = 0; i < lines.length; i += 3) {
        var n1 = lines[i];
        var n2 = lines[i + 1];
        var n3 = lines[i + 2];
        t[j] = ar[4 * n1 + 1];
        j++;
        t[j] = ar[4 * n1 + 2];
        j++;
        t[j] = ar[4 * n1 + 3];
        j++;
        t[j] = ar[4 * n2 + 1];
        j++;
        t[j] = ar[4 * n2 + 2];
        j++;
        t[j] = ar[4 * n2 + 3];
        j++;
        t[j] = ar[4 * n3 + 1];
        j++;
        t[j] = ar[4 * n3 + 2];
        j++;
        t[j] = ar[4 * n3 + 3];
        j++;
    }
    //console.log(ar.length);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        t,
        gl.STATIC_DRAW);

    gl.bufferData(gl.ARRAY_BUFFER, t, gl.STATIC_DRAW);
}

function setNormals(gl) {
    const normals = new Float32Array(4 * lines.length);
    var j = 0;
    for (var i = 0; i < lines.length; i += 3) {
        var n1 = lines[i];
        var n2 = lines[i + 1];
        var n3 = lines[i + 2];
        var x1 = ar[4 * n1 + 1];
        var y1 = ar[4 * n1 + 2];
        var z1 = ar[4 * n1 + 3];
        var x2 = ar[4 * n2 + 1];
        var y2 = ar[4 * n2 + 2];
        var z2 = ar[4 * n2 + 3];
        var x3 = ar[4 * n3 + 1];
        var y3 = ar[4 * n3 + 2];
        var z3 = ar[4 * n3 + 3];
        for (var ii = 0; ii < 3; ii++) {
            normals[j] = getnx(x1, y1, z1, x2, y2, z2, x3, y3, z3);
            j++;
            normals[j] = getny(x1, y1, z1, x2, y2, z2, x3, y3, z3);
            j++;
            normals[j] = getnz(x1, y1, z1, x2, y2, z2, x3, y3, z3);
            j++;
        }
    }
    //console.log(normals);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}

function readFile() {
    console.log("readFile");
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    var arrayBuffer;
    var decoder = new TextDecoder();
    reader.onload = function () {
        //document.getElementById("out").innerHTML=reader.result
        arrayBuffer = reader.result;
        var arr = new Uint8Array(arrayBuffer);
        var fullText = decoder.decode(arr);
        var i = 0;
        fullText += 'f';
        i += fullText.indexOf('\nv ') + 2;
        var str = '';
        var j = 0;
        var n = 0;
        while (fullText[i] != 't') {
            while (fullText[i] == ' ') {
                i++;
            }
            ar[j] = n;
            n++;
            j++;
            while (fullText[i] != ' ') {
                str += fullText[i];
                i++;
            }
            ar[j] = parseFloat(str);
            str = '';
            j++;
            while (fullText[i] == ' ') {
                i++;
            }

            while (fullText[i] != ' ') {
                str += fullText[i];
                i++;
            }
            ar[j] = parseFloat(str);
            str = '';
            j++;
            while (fullText[i] == ' ') {
                i++;
            }
            while (fullText[i] != 'v') {
                str += fullText[i];
                i++;
            }
            ar[j] = parseFloat(str);
            str = '';
            j++;
            i++;
        }

        i = fullText.indexOf('\nf ') + 2;
        j = 0;
        while (i < fullText.length) {
            while (fullText[i] == ' ') {
                i++;
            }
            while (fullText[i] != '/') {
                str += fullText[i];
                i++;
            }
            while (fullText[i] != ' ') {
                i++;
            }
            lines[j] = parseInt(str) - 1;
            str = '';
            j++;
            while (fullText[i] == ' ') {
                i++;
            }
            while (fullText[i] != '/') {
                str += fullText[i];
                i++;
            }
            while (fullText[i] != ' ') {
                i++;
            }
            lines[j] = parseInt(str) - 1;
            str = '';
            j++;
            while (fullText[i] == ' ') {
                i++;
            }
            while (fullText[i] != '/') {
                str += fullText[i];
                i++;
            }
            while (fullText[i] != 'f') {
                i++;
            }
            lines[j] = parseInt(str) - 1;
            str = '';
            j++;
            i++;
        }
    };
    reader.readAsArrayBuffer(file);
}

/*function readFile() {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        var contents = event.target.result;
        console.log("���������� �����: " + contents);
    };

    reader.onerror = function (event) {
        console.error("���� �� ����� ���� ��������! ��� " + event.target.error.code);
    };

    reader.readAsText(file);
}*/


function readLines() {
    var file = document.getElementById("fileln").files[0];
    var reader = new FileReader();
    var arrayBuffer;
    reader.onload = function () {
        //document.getElementById("out").innerHTML=reader.result
        arrayBuffer = reader.result;
        var arr = new Int32Array(arrayBuffer);
        var j = 0;
        for (var i = 0; i < arrayBuffer.byteLength; i++) {
            if (i % 4 != 0) {
                lines[j] = arr[i];
                j++;
            }
        }
        lines.length -= 2304;
        for (var i = 0; i < lines.length; i++) {
            //console.log(lines[i]);
        }
    }
    //reader.readAsText(file);
    reader.readAsArrayBuffer(file);
}

function getnx(x3, y3, z3, x2, y2, z2, x1, y1, z1) {
    var vx1 = x1 - x2;
    var vy1 = y1 - y2;
    var vz1 = z1 - z2;
    var vx2 = x2 - x3;
    var vy2 = y2 - y3;
    var vz2 = z2 - z3;
    var nx = vy1 * vz2 - vz1 * vy2;
    var ny = vz1 * vx2 - vx1 * vz2;
    var nz = vx1 * vy2 - vy1 * vx2;
    var l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx = nx / l;
    ny = ny / l;
    nz = nz / l;
    return nx;
}

function getny(x3, y3, z3, x2, y2, z2, x1, y1, z1) {
    var vx1 = x1 - x2;
    var vy1 = y1 - y2;
    var vz1 = z1 - z2;
    var vx2 = x2 - x3;
    var vy2 = y2 - y3;
    var vz2 = z2 - z3;
    var nx = vy1 * vz2 - vz1 * vy2;
    var ny = vz1 * vx2 - vx1 * vz2;
    var nz = vx1 * vy2 - vy1 * vx2;
    var l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx = nx / l;
    ny = ny / l;
    nz = nz / l;
    return ny;
}

function getnz(x3, y3, z3, x2, y2, z2, x1, y1, z1) {
    var vx1 = x1 - x2;
    var vy1 = y1 - y2;
    var vz1 = z1 - z2;
    var vx2 = x2 - x3;
    var vy2 = y2 - y3;
    var vz2 = z2 - z3;
    var nx = vy1 * vz2 - vz1 * vy2;
    var ny = vz1 * vx2 - vx1 * vz2;
    var nz = vx1 * vy2 - vy1 * vx2;
    var l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx = nx / l;
    ny = ny / l;
    nz = nz / l;
    return nz;
}