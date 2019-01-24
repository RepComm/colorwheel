"use strict";

class ColorWheelWidget {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = new Array();
        this.addColor(255, 0, 0);
        this.addColor(0, 255, 0);
        this.addColor(0, 0, 255);

        on(window, "resize", () => {
            this.recalcCanvasSize();
            this.renderPixels();
        });
        this.recalcCanvasSize();
        this.renderPixels();
    }
    addColor (r, g, b) {
        this.colors.push({
            r:r,
            g:g,
            b:b
        });
        this.renderPixels();
        return this.colors.length-1;
    }
    removeColor(index) {
        this.colors.splice(index, 1);
        this.renderPixels();
    }
    recalcCanvasSize() {
        let r = rect(this.canvas);
        let smallest = r.width < r.height ? r.width : r.height;
        
        this.canvas.width = smallest;
        this.canvas.height = smallest;
        this.canvas.style.height = r.width + "px";
    }
    /** Lerp two colors *c0* and *c1* by an amount *a*
     * @param {Object} c0 color { r:red, g:green, b:blue }
     * @param {*} c1 color { r:red, g:green, b:blue }
     * @param {*} a amount to linearly interpolate by
     */
    blendColors(c0, c1, a) {
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
    calcColor (angle, dist, wd2) {
        //Get the appropriate approximate color index at this rotation
        let approxColorIndex = lerp(0, this.colors.length, angle / 360);
        //Get nearest lower color index from the list
        let low = Math.floor(approxColorIndex);
        //Get nearest higher color index from the list
        let high = Math.ceil(approxColorIndex);

        if (high >= this.colors.length) high = 0; //Loop back around for color out of bounds
        if (low >= this.colors.length) low = 0;

        let c0 = this.colors[low];
        let c1 = this.colors[high];
        //DEBUG, shouldn't happen now
        if (!c0 || !c1) console.log(low, high, c0, c1, this.colors.length);

        //Think of this value as the arc-angle slice of pizza we want
        let anglesBetween = 360 * (1 / this.colors.length);
        //Relative angle in our slice that the current rotation is in
        let angleRelative = angle % anglesBetween;
        //Percentage ^^ is between 0.0 and 1.0
        let amount = angleRelative / anglesBetween;

        let c = this.blendColors(c0, c1, amount);
        c[0] /= dist / wd2;
        c[1] /= dist / wd2;
        c[2] /= dist / wd2;

        return c;
    }
    renderPixels () {
        let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imgData.data;
    
        let smallest = this.canvas.width > this.canvas.height ? this.canvas.width : this.canvas.height;
    
        //let w = canvas.width, wd2 = w / 2;
        let w = this.canvas.width, wd2 = w / 2;
        //let h = canvas.height, hd2 = h / 2;
        let h = this.canvas.height, hd2 = h / 2;
        let x, y, angle, c;
    
        //Loop through every pixel in our image
        for (let i = 0; i < data.length; i += 4) {
            //Calculate x, y, and their distance from center
            x = Utils.IndexToTwoDimX(i / 4, w);
            y = Utils.IndexToTwoDimY(i / 4, w);
            let d = dist(x, y, wd2, hd2);
    
            // if (d + 5 > wd2) {
            //     data[i + 0] = 0;
            //     data[i + 1] = 0;
            //     data[i + 2] = 0;
            //     data[i + 3] = 0;
            //     continue;
            // }
    
            angle = degrees(
                Math.atan2(
                    y - hd2,
                    x - wd2
                )
            ) + 180; //Rotate by 180* to rid ourselves of negative rotations
    
            c = this.calcColor(angle, d, wd2);
    
            data[i + 0] = c[0];
            data[i + 1] = c[1];
            data[i + 2] = c[2];
            data[i + 3] = 255;
        }
        this.ctx.putImageData(imgData, 0, 0);
    }
}
