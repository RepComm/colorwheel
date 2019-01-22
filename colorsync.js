"use strict";

//Get an element by its ID, alias
let get = (id) => document.getElementById(id);
//Get bounding rectangle, alias
let rect = (e) => e.getBoundingClientRect();
//Create an element, alias
let make = (type) => document.createElement(type);
//AddEventListener alias
let on = (elem, type, callback, options) => elem.addEventListener(type, callback, options);

//Maths section
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

let canvas = get("canvas");
let ctx = canvas.getContext("2d");

let recalcCanvasSize = () => {
    let r = rect(canvas);
    let smallest = r.width < r.height ? r.width : r.height;
    canvas.width = smallest;
    canvas.height = smallest;
}

/** Lerp two colors *c0* and *c1* by an amount *a*
 * @param {Object} c0 color { r:red, g:green, b:blue }
 * @param {*} c1 color { r:red, g:green, b:blue }
 * @param {*} a amount to linearly interpolate by
 */
let blendColors = (c0, c1, a) => {
    return [
        lerp(c0.r, c1.r, a),
        lerp(c0.g, c1.g, a),
        lerp(c0.b, c1.b, a)
    ];
}

/** Calculate a pixel color based on a rotation angle
 * @param {Array} colors array of colors to use
 * @param {Float} angle degrees angle of the current pixel (context) from the center of canvas
 */
let calcColor = (colors, angle) => {
    //Get the appropriate approximate color index at this rotation
    let approxColorIndex = lerp(0, colors.length, angle / 360);
    //Get nearest lower color index from the list
    let low = Math.floor(approxColorIndex);
    //Get nearest higher color index from the list
    let high = Math.ceil(approxColorIndex);

    if (high >= colors.length) high = 0; //Loop back around for color out of bounds
    if (low >= colors.length) low = 0;

    let c0 = colors[low];
    let c1 = colors[high];
    //DEBUG, shouldn't happen now
    if (!c0 || !c1) console.log(low, high, c0, c1, colors.length);

    //Think of this value as the arc-angle slice of pizza we want
    let anglesBetween = 360 * (1 / colors.length);
    //Relative angle in our slice that the current rotation is in
    let angleRelative = angle % anglesBetween;
    //Percentage ^^ is between 0.0 and 1.0
    let amount = angleRelative / anglesBetween;

    return blendColors(c0, c1, amount); //Return the blended color
}

let renderPixels = (colors) => {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    let w = canvas.width, wd2 = w / 2;
    let h = canvas.height, hd2 = h / 2;
    let x, y, angle, c;

    //Loop through every pixel in our image
    for (let i = 0; i < data.length; i += 4) {
        //Calculate x, y, and their distance from center
        x = Utils.IndexToTwoDimX(i / 4, w);
        y = Utils.IndexToTwoDimY(i / 4, w);
        let d = dist(x, y, wd2, hd2);

        angle = degrees(
                Math.atan2(
                    y - hd2,
                    x - wd2
                )
        ) + 180; //Rotate by 180* to rid ourselves of negative rotations

        c = calcColor(colors, angle);

        data[i + 0] = c[0]; //parseInt(r); //Red
        data[i + 1] = c[1]; //parseInt(g); //Green
        data[i + 2] = c[2]; //parseInt(b); //Blue
        data[i + 3] = 255;
        
        //Do something if pixel is out of circular radius
        if (d + 10 > wd2) {
            let t0 = data[i + 0]; //Red
            let t1 = data[i + 1]; //Green
            let t2 = data[i + 2]; //Blue
            //Swapping channels just for fun
            data[i + 0] = t1;
            data[i + 1] = t2;
            data[i + 2] = t0;
            data[i + 3] = 255;
            continue;
        }
    }
    //Put the pixel data back
    ctx.putImageData(imgData, 0, 0);
}

recalcCanvasSize(); //Force recalculate canvas size once

//List of colors we'll keep
let cols = [
];

let addColor = (r, g, b) => {
    cols.push({
        r: r, g: g, b: b
    });
    renderPixels(cols);
    return cols.length - 1;
}

//Add some default colors
addColor(0, 0, 255);
addColor(0, 255, 0);
addColor(255, 0, 0);

let removeColor = (ind) => {
    cols.splice(ind, 1);
    renderPixels(cols);
}

//Force rendering everything once
renderPixels(cols);

on(window, "resize", () => {
    recalcCanvasSize();
    renderPixels(cols);
});
