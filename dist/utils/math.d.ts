export declare var m3: {
    translate: (m: any, tx: any, ty: any) => number[];
    rotate: (m: any, angleInRadians: any) => number[];
    scale: (m: any, sx: any, sy: any) => number[];
    translation: (tx: number, ty: number) => number[];
    projection: (width: any, height: any) => number[];
    rotation: (angleInRadians: number) => number[];
    scaling: (sx: number, sy: number) => number[];
    multiply: (a: any, b: any) => number[];
    identity: () => number[];
};
export declare const m4: {
    translation: (tx: number, ty: number, tz: number) => number[];
    xRotation: (angleInRadians: number) => number[];
    yRotation: (angleInRadians: number) => number[];
    zRotation: (angleInRadians: number) => number[];
    scaling: (sx: number, sy: number, sz: number) => number[];
    translate: (m: any, tx: number, ty: number, tz: number) => number[];
    xRotate: (m: any, angleInRadians: number) => number[];
    yRotate: (m: any, angleInRadians: number) => number[];
    zRotate: (m: any, angleInRadians: number) => number[];
    scale: (m: any, sx: number, sy: number, sz: number) => number[];
    projection: (width: number, height: number, depth: number) => number[];
    multiply: (a: any, b: any) => number[];
};
export declare function radToDeg(r: any): number;
export declare function degToRad(d: any): number;
