import { CONFIG } from './constant/config'
import * as BABYLON from 'babylonjs';
import { Shader } from "./shader/shader";
import { initWebgl, createTexture, createProgramFromShader } from "./utils/render";
import { rectangle, fAlpha3d, } from "./utils/geometry";
import { m4, radToDeg, degToRad } from "./utils/math";
declare const webglLessonsUI
declare const webglUtils
declare const $
const { vs, fs } = Shader[4]
const gl = initWebgl()
const program = createProgramFromShader(gl, vs, fs)
gl.useProgram(program)

let colorLocation = gl.getUniformLocation(program, 'u_color')
let positionLocation = gl.getAttribLocation(program, 'a_position')
let modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix")
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fAlpha3d()), gl.STATIC_DRAW)
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
let color: Array<number> = [Math.random(), Math.random(), Math.random(), 1]
gl.uniform4fv(colorLocation, color)

let translation: Array<number> = [147, 150, 0]
let scale = [1, 1, 1]
let rotation = [degToRad(40), degToRad(25), degToRad(325)];
var angleInRadians = 0;
webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
webglLessonsUI.setupSlider("#z", { slide: updatePosition(2), max: gl.canvas.height });
webglLessonsUI.setupSlider("#angleX", { value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360 });
webglLessonsUI.setupSlider("#angleY", { value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360 });
webglLessonsUI.setupSlider("#angleZ", { value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360 });
webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
webglLessonsUI.setupSlider("#scaleZ", { value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2 });
drawScene()
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
function updatePosition(index) {
    return function (event, ui) {
        translation[index] = ui.value;
        drawScene();
    };
}

function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    var matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    gl.uniformMatrix4fv(modelMatrixLocation, false, matrix)

    gl.drawArrays(gl.TRIANGLES, 0, 16*6)
    //nothing
}

