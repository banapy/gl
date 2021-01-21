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
