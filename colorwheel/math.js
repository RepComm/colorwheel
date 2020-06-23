let Utils = {
  /** Convert two dimensional coordinates to a one dimensional index
   * @param {Integer} x coordinate
   * @param {Integer} y coordinate
   * @param {Integer} width of bounding grid
   */
  TwoDimToIndex(x, y, width) {
    return x + width * y;
  },
  /** Convert one dimensional index to two dimensional X coordinate
   * @param {Integer} index one dimensional offset index
   * @param {Integer} width of bounding grid
   */
  IndexToTwoDimX(index, width) {
    return index % width;
  },
  /** Convert one dimensional index to two dimensional Y coordinate
   * @param {Integer} index one dimensional offset index
   * @param {Integer} width of bounding grid
   */
  IndexToTwoDimY(index, width) {
    return index / width;
  },
  /** Round *n* to the next increment of *next* argument
   * @param {Number} n to round
   * @param {Number} next round up to in increments of this number
   */
  roundToNext(n, next) {
    let isNeg = (n < 0);
    if (isNeg) { n -= next };
    let resto = n % next;
    if (resto <= (next)) {
      return n - resto;
    } else {
      return n + next - resto;
    }
  },
  /** Regular round, but with added 'to' option
   * @param {Number} n number to round
   * @param {Number} to round to
   */
  roundTo(n, to) {
    var resto = n % to;
    if (resto <= (to / 2)) {
      return n - resto;
    } else {
      return n + to - resto;
    }
  }
};
let pi = 3.141592653589793; //All the digits I could remember..

let radians = (degrees) => degrees * (pi / 180);
let degrees = (radians) => radians * (180 / pi);
let lerp = (a, b, c) => a + c * (b - a);

let lerpClamped = (a, b, c)=> {
  return lerp(a, b, clamp(c, 0, 1));
};

let dist = (x1, y1, x2, y2) => Math.sqrt(
  Math.pow(x1 - x2, 2) +
  Math.pow(y1 - y2, 2)
);

let ndist = (n1, n2) => Math.abs(Math.abs(n1) - Math.abs(n2));

let isAnyOf = (e, list) => {
  for (let item of list) {
    if (item == e) return true;
  }
  return false;
}

let pointInRect = (x, y, rx, ry, rw, rh) => (
  x > rx &&
  x < rx + rw &&
  y > ry &&
  y < ry + rh
);

/**Modified from https://stackoverflow.com/a/3368118
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 * @param {Number|{topLeft:Number,topRight:Number,bottomRight:Number,bottomLeft:Number}} radius
 */
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

/**Clamp a number between a min and max
 * @param {number} n to clamp
 * @param {number} min value
 * @param {number} max value
 */
let clamp = (n, min=0, max=1)=> {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export { Utils, dist, lerp, lerpClamped, degrees, radians, pi, ndist, isAnyOf, pointInRect, roundRect, clamp };