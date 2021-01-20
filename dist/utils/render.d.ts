export declare function createCanvas(width: number, height: number): {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
};
export declare function createCanvasAndAppend(width: number, height: number, selector: string): {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
};
export declare function initWebgl(): WebGLRenderingContext;
export declare function setGeometry(gl: WebGLRenderingContext): void;
export declare function drawScene(gl: WebGLRenderingContext): void;
export declare function createProgramFromShader(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram;
export declare function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader;
export declare function createProgram(gl: WebGLRenderingContext, vshader: WebGLShader, fshader: WebGLShader): WebGLProgram;
export declare function createTexture(gl: any): any;
export declare function createTextureCoord(): number[];
