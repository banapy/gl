import { CONFIG } from './constant/config'
import * as BABYLON from 'babylonjs';
import { Shader } from "./shader/shader";
import { initWebgl, createTexture, createProgramFromShader } from "./utils/render";
import { rectangle, fAlpha } from "./utils/geometry";
import { m3 } from "./utils/math";
declare const webglLessonsUI
declare const webglUtils
declare const $
const { vs, fs } = Shader[3]
const gl = initWebgl()
const program = createProgramFromShader(gl, vs, fs)
gl.useProgram(program)

let colorLocation = gl.getUniformLocation(program, 'u_color')
let positionLocation = gl.getAttribLocation(program, 'a_position')
let modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix")
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fAlpha(0, 0)), gl.STATIC_DRAW)
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
let color: Array<number> = [Math.random(), Math.random(), Math.random(), 1]
gl.uniform4fv(colorLocation, color)

let translation: Array<number> = [0, 0]
let scale = [1, 1]
var angleInRadians = 0;
webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });
webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
drawScene()
function updateAngle(event, ui) {
    let angleInDegrees = 360 - ui.value;
    angleInRadians = angleInDegrees * Math.PI / 180;
    drawScene();
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
    gl.clear(gl.COLOR_BUFFER_BIT)

    let matrix = m3.projection(gl.canvas.width,gl.canvas.height)
    matrix = m3.translate(matrix,translation[0],translation[1])
    matrix = m3.rotate(matrix,angleInRadians)
    matrix = m3.scale(matrix,scale[0],scale[1])

    gl.uniformMatrix3fv(modelMatrixLocation, false, matrix)

    gl.drawArrays(gl.TRIANGLES, 0, 18)
}

