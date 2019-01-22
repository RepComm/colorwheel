"use strict";

let get = (id) => document.getElementById(id);
let rect = (e) => e.getBoundingClientRect();

let make = (type) => document.createElement(type);

let on = (elem, type, callback, options) => elem.addEventListener(type, callback, options);

let canvas = get("canvas");
let ctx = canvas.getContext("2d");

let Utils = {
    /* Array functions
     * Repurposed from https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
     * Thank you to Doc Brown's answer!
    */
    /* Two dimensional grid x and y point to a 1d array index
     * x - the x coordinate (integer)
     * y - the y coordinate (integer)
     * width - the width of the grid structure 
    */
    TwoDimToIndex(x, y, width) {
        return x + width * y;
    },
    /* 1d array index to 2d grid X coordinate
     * index - the index in 1d array (integer)
     * width - the width of the grid structure the returned x coordinate belongs to
    */
    IndexToTwoDimX(index, width) {
        return index % width;
    },
    /* 1d array index to 2d grid Y coordinate
     * index - the index in 1d array (integer)
     * width - the width of the grid structure the returned y coordinate belongs to
    */
    IndexToTwoDimY(index, width) {
        return index / width;
    },
    /* Round a number to the next (not nearest) number
     * Examples:
     * roundToNext(4, 5) -> returns 5
     * roundToNext(42.291, 50) -> returns 50
     * roundToNext(2.123, 3) -> returns 3
     * roundToNext(11.1, 11) -> returns 22
     * roundToNext(100.001, 100) -> returns 200
     * 
     * n - the number to round
     * next - the number to clip by (snap to highest)
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
    /* Round a number 'n' to the nearest 'to'
     * Examples:
     * roundTo(4, 5) -> returns 5
     * roundToNext(0.5, 1) -> returns 1
     * roundToNext(0.49, 1) -> returns 0
     * roundToNext(2.1, 2) -> returns 2
     * roundToNext(2.5, 1) -> returns 3
     * 
     * n - the number to round
     * to - the number to round to
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

let pi = 3.141592653589793;

let radians = (degrees) => degrees * (pi / 180);
let degrees = (radians) => radians * (180 / pi);
let lerp = (a, b, c) => {
    return a + c * (b - a);
}

let dist = (x1, y1, x2, y2)=>{
    return Math.sqrt(
        Math.pow(x1 - x2, 2) +
        Math.pow(y1 - y2, 2)
    );
}

let recalcCanvasSize = () => {
    let r = rect(canvas);
    let smallest = r.width < r.height ? r.width : r.height;
    canvas.width = smallest;
    canvas.height = smallest;
}

let blendColors = (c0, c1, a) => {
    return [
        lerp(c0.r, c1.r, a),
        lerp(c0.g, c1.g, a),
        lerp(c0.b, c1.b, a)
    ];
}

let calcColor = (colors, angle) => {
    let approxColorIndex = lerp(0, colors.length, angle/360);
    let low = Math.floor(approxColorIndex);
    let high = Math.ceil(approxColorIndex);
    
    if (high >= colors.length) high = 0; //Loop back around for color out of bounds
    if (low >= colors.length) low = 0; 

    let c0 = colors[low];
    let c1 = colors[high];
    if (!c0 || !c1) console.log(low, high, c0, c1, colors.length);

    let anglesBetween = 360*(1/colors.length); //Slice size
    let angleRelative = angle % anglesBetween;
    let amount = angleRelative/anglesBetween;

    return [
        lerp(c0.r, c1.r, amount),
        lerp(c0.g, c1.g, amount),
        lerp(c0.b, c1.b, amount)
    ];
}

let renderPixels = (colors) => {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    let w = canvas.width, wd2 = w / 2;
    let h = canvas.height, hd2 = h / 2;
    let x, y, angle;

    for (let i = 0; i < data.length; i += 4) {
        x = Utils.IndexToTwoDimX(i / 4, w);
        y = Utils.IndexToTwoDimY(i / 4, w);
        let d = dist(x, y, wd2, hd2);

        if (d-1 > wd2) {
            data[i + 0] = 0; //Red
            data[i + 1] = 0; //Green
            data[i + 2] = 0; //Blue
            data[i + 3] = 255; //parseInt(Math.random()*255); //Alpha
            continue;
        }

        angle =
            degrees(
                Math.atan2(
                    y - hd2,
                    x - wd2
                )
            )+180;

        let c = calcColor(colors, angle);

        data[i + 0] = c[0]; //parseInt(r); //Red
        data[i + 1] = c[1]; //parseInt(g); //Green
        data[i + 2] = c[2]; //parseInt(b); //Blue
        data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
}

let render = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Will always clear the right space
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.restore();
    //ctx.strokeStyle ctx.lineWidth ctx.lineCap
    //ctx.save ctx.scale ctx.translate ctx.restore
    //ctx.beginPath ctx.stroke
}

recalcCanvasSize();

let cols = [
    { r: 195, g: 63, b: 166 },
    { r: 89, g: 0, b: 107 },
    { r: 39, g: 201, b: 52 },
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 }
];

renderPixels(cols);

on(window, "resize", () => {
    recalcCanvasSize();
    renderPixels(cols);
});
