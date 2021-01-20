export function rectangle(x: number, y: number, width: number, height: number) {
  let x1 = x
  let x2 = x + width
  let y1 = y
  let y2 = y + height
  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]
}
export function fAlpha(x: number, y: number) {
  let width: number = 100;
  let height: number = 150;
  let thickness: number = 30;
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
  ]
}
export function randomInt(range: number) {
  return Math.floor(Math.random() * range)
}
export const kernels = {
  normal: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0
  ],
  gaussianBlur: [
    0.045, 0.122, 0.045,
    0.122, 0.332, 0.122,
    0.045, 0.122, 0.045
  ],
  gaussianBlur2: [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1
  ],
  gaussianBlur3: [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0
  ],
  unsharpen: [
    -1, -1, -1,
    -1, 9, -1,
    -1, -1, -1
  ],
  sharpness: [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ],
  sharpen: [
    -1, -1, -1,
    -1, 16, -1,
    -1, -1, -1
  ],
  edgeDetect: [
    -0.125, -0.125, -0.125,
    -0.125, 1, -0.125,
    -0.125, -0.125, -0.125
  ],
  edgeDetect2: [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1
  ],
  edgeDetect3: [
    -5, 0, 0,
    0, 0, 0,
    0, 0, 5
  ],
  edgeDetect4: [
    -1, -1, -1,
    0, 0, 0,
    1, 1, 1
  ],
  edgeDetect5: [
    -1, -1, -1,
    2, 2, 2,
    -1, -1, -1
  ],
  edgeDetect6: [
    -5, -5, -5,
    -5, 39, -5,
    -5, -5, -5
  ],
  sobelHorizontal: [
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1
  ],
  sobelVertical: [
    1, 0, -1,
    2, 0, -2,
    1, 0, -1
  ],
  previtHorizontal: [
    1, 1, 1,
    0, 0, 0,
    -1, -1, -1
  ],
  previtVertical: [
    1, 0, -1,
    1, 0, -1,
    1, 0, -1
  ],
  boxBlur: [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111
  ],
  triangleBlur: [
    0.0625, 0.125, 0.0625,
    0.125, 0.25, 0.125,
    0.0625, 0.125, 0.0625
  ],
  emboss: [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2
  ]
};