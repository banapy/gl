
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    let Shader = [
        {
            id: 1,
            vs: `
                vec2 pixelToClipSpace(vec2 position,vec2 resolution){
                    return ((position / resolution )*2.0-1.0)*vec2(1,-1);
                }
                uniform vec2 u_resolution;
                attribute vec2 a_position;
                void main(){
                    vec2 clipSpace = pixelToClipSpace(a_position,u_resolution);
                    gl_Position = vec4(clipSpace,0.0,1);
                }
            `,
            fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color;
            }   
        `
        },
        {
            id: 2,
            vs: `
                vec2 pixelToClipSpace(vec2 position,vec2 resolution){
                    return ((position / resolution )*2.0-1.0)*vec2(1,-1);
                }
                attribute vec2 a_textCoord;
                attribute vec2 a_position;
                varying vec2 v_textCoord;
                uniform vec2 u_resolution;
                void main(){
                    vec2 clipSpace = pixelToClipSpace(a_position,u_resolution);
                    gl_Position = vec4(clipSpace,0.0,1);
                    v_textCoord = a_textCoord;
                }
            `,
            fs: `
            precision mediump float;
            vec4 mediumPixel(sampler2D u_image,vec2 v_textCoord,vec2 u_textureSize){
                vec2 onePixel = vec2(1.0,1.0) / u_textureSize;
                vec4 tempColor =   (
                    texture2D(u_image, v_textCoord) +
                    texture2D(u_image, v_textCoord + vec2(onePixel.x,0.0)) +
                    texture2D(u_image, v_textCoord + vec2(-onePixel.x,0.0))
                ) / 3.0;
                return tempColor;
            }
            uniform sampler2D u_image;
            uniform vec2 u_textureSize;
            varying vec2 v_textCoord;
            void main() {
                gl_FragColor = mediumPixel(u_image,v_textCoord,u_textureSize);
       
            }
        `
        },
        {
            id: 3,
            vs: `
                vec2 pixelToClipSpace(vec2 position,vec2 resolution){
                    return ((position / resolution )*2.0-1.0)*vec2(1,-1);
                }
                vec2 rotatedPosition(vec2 a_position,vec2 u_rotation){
                    return vec2(
                        a_position.x * u_rotation.y + a_position.y * u_rotation.x,
                        a_position.y * u_rotation.y - a_position.x * u_rotation.x
                    );
                }
                vec2 scaledPosition(vec2 a_position,vec2 u_scale){
                    return a_position*u_scale;
                }
                attribute vec2 a_position;
                uniform vec2 u_translation;
                uniform vec2 u_resolution;
                uniform vec2 u_rotation;
                uniform vec2 u_scale;
                void main(){
                    vec2 scledPosition = scaledPosition(a_position,u_scale);
                    vec2 rotatedPosition = rotatedPosition(scledPosition,u_rotation);
                    vec2 clipSpace = pixelToClipSpace(rotatedPosition+u_translation,u_resolution);
                    gl_Position = vec4(clipSpace,0.0,1);
                }
            `,
            fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color ;
            }
        `
        },
        {
            id: 4,
            vs: `
                attribute vec2 a_position;
                uniform mat3 u_modelMatrix;
                void main(){
                    vec2 modelPosition = (u_modelMatrix*vec3(a_position,1)).xy;
                    gl_Position = vec4(modelPosition,0.0,1);
                }
            `,
            fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color ;
            }
        `
        },
    ];

    const CONFIG = {
        Canvas: {
            Width: 900,
            Height: 600
        }
    };

    function createCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = height;
        canvas.height = width;
        const gl = canvas.getContext("webgl");
        return { canvas, gl };
    }
    function createCanvasAndAppend(width, height, selector) {
        const createRes = createCanvas(width, height);
        document.querySelector(selector).appendChild(createRes.canvas);
        return createRes;
    }
    function initWebgl() {
        const { canvas, gl } = createCanvasAndAppend(CONFIG.Canvas.Height, CONFIG.Canvas.Width, "body");
        canvas.style.border = "1px solid black";
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return gl;
    }
    function createProgramFromShader(gl, vs, fs) {
        let vshader = createShader(gl, gl.VERTEX_SHADER, vs);
        let fshader = createShader(gl, gl.FRAGMENT_SHADER, fs);
        let program = createProgram(gl, vshader, fshader);
        return program;
    }
    function createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    function createProgram(gl, vshader, fshader) {
        let program = gl.createProgram();
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    function fAlpha(x, y) {
        let width = 100;
        let height = 150;
        let thickness = 30;
        return [
            // 左竖
            x, y,
            x + thickness, y,
            x, y + height,
            x, y + height,
            x + thickness, y,
            x + thickness, y + height,
            // 上横
            x + thickness, y,
            x + width, y,
            x + thickness, y + thickness,
            x + thickness, y + thickness,
            x + width, y,
            x + width, y + thickness,
            // 中横
            x + thickness, y + thickness * 2,
            x + width * 2 / 3, y + thickness * 2,
            x + thickness, y + thickness * 3,
            x + thickness, y + thickness * 3,
            x + width * 2 / 3, y + thickness * 2,
            x + width * 2 / 3, y + thickness * 3,
        ];
    }

    var m3 = {
        translate: function (m, tx, ty) {
            return m3.multiply(m, m3.translation(tx, ty));
        },
        rotate: function (m, angleInRadians) {
            return m3.multiply(m, m3.rotation(angleInRadians));
        },
        scale: function (m, sx, sy) {
            return m3.multiply(m, m3.scaling(sx, sy));
        },
        translation: function (tx, ty) {
            return [
                1, 0, 0,
                0, 1, 0,
                tx, ty, 1,
            ];
        },
        projection: function (width, height) {
            // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
            return [
                2 / width, 0, 0,
                0, -2 / height, 0,
                -1, 1, 1
            ];
        },
        rotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            return [
                c, -s, 0,
                s, c, 0,
                0, 0, 1,
            ];
        },
        scaling: function (sx, sy) {
            return [
                sx, 0, 0,
                0, sy, 0,
                0, 0, 1,
            ];
        },
        multiply: function (a, b) {
            var a00 = a[0 * 3 + 0];
            var a01 = a[0 * 3 + 1];
            var a02 = a[0 * 3 + 2];
            var a10 = a[1 * 3 + 0];
            var a11 = a[1 * 3 + 1];
            var a12 = a[1 * 3 + 2];
            var a20 = a[2 * 3 + 0];
            var a21 = a[2 * 3 + 1];
            var a22 = a[2 * 3 + 2];
            var b00 = b[0 * 3 + 0];
            var b01 = b[0 * 3 + 1];
            var b02 = b[0 * 3 + 2];
            var b10 = b[1 * 3 + 0];
            var b11 = b[1 * 3 + 1];
            var b12 = b[1 * 3 + 2];
            var b20 = b[2 * 3 + 0];
            var b21 = b[2 * 3 + 1];
            var b22 = b[2 * 3 + 2];
            return [
                b00 * a00 + b01 * a10 + b02 * a20,
                b00 * a01 + b01 * a11 + b02 * a21,
                b00 * a02 + b01 * a12 + b02 * a22,
                b10 * a00 + b11 * a10 + b12 * a20,
                b10 * a01 + b11 * a11 + b12 * a21,
                b10 * a02 + b11 * a12 + b12 * a22,
                b20 * a00 + b21 * a10 + b22 * a20,
                b20 * a01 + b21 * a11 + b22 * a21,
                b20 * a02 + b21 * a12 + b22 * a22,
            ];
        },
        identity: function () {
            return [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ];
        },
    };

    const { vs, fs } = Shader[3];
    const gl = initWebgl();
    const program = createProgramFromShader(gl, vs, fs);
    gl.useProgram(program);
    let colorLocation = gl.getUniformLocation(program, 'u_color');
    let positionLocation = gl.getAttribLocation(program, 'a_position');
    let modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fAlpha(0, 0)), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    let color = [Math.random(), Math.random(), Math.random(), 1];
    gl.uniform4fv(colorLocation, color);
    let translation = [0, 0];
    let scale = [1, 1];
    var angleInRadians = 0;
    webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
    webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });
    webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
    webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
    drawScene();
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
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        let matrix = m3.projection(gl.canvas.width, gl.canvas.height);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);
        gl.uniformMatrix3fv(modelMatrixLocation, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 18);
    }

})));
//# sourceMappingURL=bundle.js.map
