(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('crypto')) :
    typeof define === 'function' && define.amd ? define(['crypto'], factory) :
    (factory(global.crypto));
}(this, (function (crypto) { 'use strict';

    function createCanvas() {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");

        return { canvas, gl };
    }
    function createCanvasAndAppend(selector) {
        const createRes = createCanvas();
        document.querySelector(selector).appendChild(createRes.canvas);
        return createRes;
    }
    const { canvas, gl } = createCanvasAndAppend("body");
    canvas.width = 900;
    canvas.height = 600;
    console.log("test");

})));
