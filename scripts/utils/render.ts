import { CONFIG } from '../constant/config'

export function createCanvas(width: number, height: number) {
    const canvas = document.createElement("canvas")
    canvas.width = height
    canvas.height = width
    const gl = canvas.getContext("webgl")
    return { canvas, gl }
}
export function createCanvasAndAppend(width: number, height: number, selector: string) {
    const createRes = createCanvas(width, height)
    document.querySelector(selector).appendChild(createRes.canvas)
    return createRes
}
export function initWebgl() {
    const { canvas, gl } = createCanvasAndAppend(CONFIG.Canvas.Height, CONFIG.Canvas.Width, "body")
    canvas.style.border = "1px solid black"
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return gl
}
export function setGeometry(gl: WebGLRenderingContext) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, -100, 150, 125, -175, 100
    ]), gl.STATIC_DRAW)
}
export function drawScene(gl: WebGLRenderingContext) {
    let primitiveType = gl.TRIANGLES
    let offset = 0
    let count = 3
    gl.drawArrays(primitiveType, offset, count)
}
export function createProgramFromShader(gl: WebGLRenderingContext, vs: string, fs: string) {
    let vshader = createShader(gl, gl.VERTEX_SHADER, vs)
    let fshader = createShader(gl, gl.FRAGMENT_SHADER, fs)
    let program = createProgram(gl, vshader, fshader)
    return program
}
export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}
export function createProgram(gl: WebGLRenderingContext, vshader: WebGLShader, fshader: WebGLShader) {
    let program = gl.createProgram()
    gl.attachShader(program, vshader)
    gl.attachShader(program, fshader)
    gl.linkProgram(program)
    let success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}
export function createTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);


    // 设置材质，这样我们可以对任意大小的图像进行像素操作
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}
export function createTextureCoord() {
    return [0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0]
}