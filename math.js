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

let dist = (x1, y1, x2, y2) => Math.sqrt(
    Math.pow(x1 - x2, 2) +
    Math.pow(y1 - y2, 2)
);