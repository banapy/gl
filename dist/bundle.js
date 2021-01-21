
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
        {
            id: 5,
            vs: `
                attribute vec3 a_position;
                uniform mat4 u_modelMatrix;
                void main(){
                    vec3 modelPosition = (u_modelMatrix*vec4(a_position,1)).xyz;
                    gl_Position = vec4(modelPosition,1);
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

    function fAlpha3d() {
        return [
            // left column front
            0, 0, 0,
            0, 150, 0,
            30, 0, 0,
            0, 150, 0,
            30, 150, 0,
            30, 0, 0,
            // top rung front
            30, 0, 0,
            30, 30, 0,
            100, 0, 0,
            30, 30, 0,
            100, 30, 0,
            100, 0, 0,
            // middle rung front
            30, 60, 0,
            30, 90, 0,
            67, 60, 0,
            30, 90, 0,
            67, 90, 0,
            67, 60, 0,
            // left column back
            0, 0, 30,
            30, 0, 30,
            0, 150, 30,
            0, 150, 30,
            30, 0, 30,
            30, 150, 30,
            // top rung back
            30, 0, 30,
            100, 0, 30,
            30, 30, 30,
            30, 30, 30,
            100, 0, 30,
            100, 30, 30,
            // middle rung back
            30, 60, 30,
            67, 60, 30,
            30, 90, 30,
            30, 90, 30,
            67, 60, 30,
            67, 90, 30,
            // top
            0, 0, 0,
            100, 0, 0,
            100, 0, 30,
            0, 0, 0,
            100, 0, 30,
            0, 0, 30,
            // top rung right
            100, 0, 0,
            100, 30, 0,
            100, 30, 30,
            100, 0, 0,
            100, 30, 30,
            100, 0, 30,
            // under top rung
            30, 30, 0,
            30, 30, 30,
            100, 30, 30,
            30, 30, 0,
            100, 30, 30,
            100, 30, 0,
            // between top rung and middle
            30, 30, 0,
            30, 60, 30,
            30, 30, 30,
            30, 30, 0,
            30, 60, 0,
            30, 60, 30,
            // top of middle rung
            30, 60, 0,
            67, 60, 30,
            30, 60, 30,
            30, 60, 0,
            67, 60, 0,
            67, 60, 30,
            // right of middle rung
            67, 60, 0,
            67, 90, 30,
            67, 60, 30,
            67, 60, 0,
            67, 90, 0,
            67, 90, 30,
            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,
            // right of bottom
            30, 90, 0,
            30, 150, 30,
            30, 90, 30,
            30, 90, 0,
            30, 150, 0,
            30, 150, 30,
            // bottom
            0, 150, 0,
            0, 150, 30,
            30, 150, 30,
            0, 150, 0,
            30, 150, 30,
            30, 150, 0,
            // left side
            0, 0, 0,
            0, 0, 30,
            0, 150, 30,
            0, 0, 0,
            0, 150, 30,
            0, 150, 0
        ];
    }

    const m4 = {
        translation: function (tx, ty, tz) {
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                tx, ty, tz, 1,
            ];
        },
        xRotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            return [
                1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1,
            ];
        },
        yRotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            return [
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1,
            ];
        },
        zRotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            return [
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];
        },
        scaling: function (sx, sy, sz) {
            return [
                sx, 0, 0, 0,
                0, sy, 0, 0,
                0, 0, sz, 0,
                0, 0, 0, 1,
            ];
        },
        translate: function (m, tx, ty, tz) {
            return m4.multiply(m, m4.translation(tx, ty, tz));
        },
        xRotate: function (m, angleInRadians) {
            return m4.multiply(m, m4.xRotation(angleInRadians));
        },
        yRotate: function (m, angleInRadians) {
            return m4.multiply(m, m4.yRotation(angleInRadians));
        },
        zRotate: function (m, angleInRadians) {
            return m4.multiply(m, m4.zRotation(angleInRadians));
        },
        scale: function (m, sx, sy, sz) {
            return m4.multiply(m, m4.scaling(sx, sy, sz));
        },
        projection: function (width, height, depth) {
            // Note: This matrix flips the Y axis so 0 is at the top.
            return [
                2 / width, 0, 0, 0,
                0, -2 / height, 0, 0,
                0, 0, 2 / depth, 0,
                -1, 1, 0, 1,
            ];
        },
        multiply: function (a, b) {
            var a00 = a[0 * 4 + 0];
            var a01 = a[0 * 4 + 1];
            var a02 = a[0 * 4 + 2];
            var a03 = a[0 * 4 + 3];
            var a10 = a[1 * 4 + 0];
            var a11 = a[1 * 4 + 1];
            var a12 = a[1 * 4 + 2];
            var a13 = a[1 * 4 + 3];
            var a20 = a[2 * 4 + 0];
            var a21 = a[2 * 4 + 1];
            var a22 = a[2 * 4 + 2];
            var a23 = a[2 * 4 + 3];
            var a30 = a[3 * 4 + 0];
            var a31 = a[3 * 4 + 1];
            var a32 = a[3 * 4 + 2];
            var a33 = a[3 * 4 + 3];
            var b00 = b[0 * 4 + 0];
            var b01 = b[0 * 4 + 1];
            var b02 = b[0 * 4 + 2];
            var b03 = b[0 * 4 + 3];
            var b10 = b[1 * 4 + 0];
            var b11 = b[1 * 4 + 1];
            var b12 = b[1 * 4 + 2];
            var b13 = b[1 * 4 + 3];
            var b20 = b[2 * 4 + 0];
            var b21 = b[2 * 4 + 1];
            var b22 = b[2 * 4 + 2];
            var b23 = b[2 * 4 + 3];
            var b30 = b[3 * 4 + 0];
            var b31 = b[3 * 4 + 1];
            var b32 = b[3 * 4 + 2];
            var b33 = b[3 * 4 + 3];
            return [
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
            ];
        },
    };
    function radToDeg(r) {
        return r * 180 / Math.PI;
    }
    function degToRad(d) {
        return d * Math.PI / 180;
    }

    const { vs, fs } = Shader[4];
    const gl = initWebgl();
    const program = createProgramFromShader(gl, vs, fs);
    gl.useProgram(program);
    let colorLocation = gl.getUniformLocation(program, 'u_color');
    let positionLocation = gl.getAttribLocation(program, 'a_position');
    let modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fAlpha3d()), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    let color = [Math.random(), Math.random(), Math.random(), 1];
    gl.uniform4fv(colorLocation, color);
    let translation = [147, 150, 0];
    let scale = [1, 1, 1];
    let rotation = [degToRad(40), degToRad(25), degToRad(325)];
    webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
    webglLessonsUI.setupSlider("#z", { slide: updatePosition(2), max: gl.canvas.height });
    webglLessonsUI.setupSlider("#angleX", { value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360 });
    webglLessonsUI.setupSlider("#angleY", { value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360 });
    webglLessonsUI.setupSlider("#angleZ", { value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360 });
    webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
    webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
    webglLessonsUI.setupSlider("#scaleZ", { value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2 });
    drawScene();
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
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        var matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
        matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
        gl.uniformMatrix4fv(modelMatrixLocation, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
        //nothing
    }

})));
//# sourceMappingURL=bundle.js.map
