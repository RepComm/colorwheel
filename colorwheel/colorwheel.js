
import { on } from "./aliases.js";
import { Component } from "./component.js";
import { lerp, Utils, lerpClamped, dist, degrees } from "./math.js";

export class WheelColor {
  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }
  /**Set color by rgb
   * @param {number} r 
   * @param {number} g 
   * @param {number} b
   * @returns {WheelColor} self
   */
  setRGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  setHSV(h, s, v) {
    throw "Not implemented yet";
  }

  static fromRGB(r, g, b) {
    return new WheelColor().setRGB(r, g, b);
  }
  /**Mix two colors and output it to dest
   * @param {WheelColor} a 
   * @param {WheelColor} b 
   * @param {number} amount 
   * @param {WheelColor} dest 
   */
  static lerp(a, b, amount, dest) {
    dest.setRGB(
      lerp(a.r, b.r, amount),
      lerp(a.g, b.g, amount),
      lerp(a.b, b.b, amount)
    );
  }
  toString () {
    return `${Math.floor(this.r)}, ${Math.floor(this.g)}, ${Math.floor(this.b)}`;
  }
}

export class ColorWheel extends Component {
  constructor() {
    super();
    /**@type {Array<WheelColor>}*/
    this.colors = new Array();

    this.mixingColor = new WheelColor();

    this.make("canvas");
    /**@type {CanvasRenderingContext2D}*/
    this.ctx = this.element.getContext("2d");

    /**@type {ImageData|undefined} */
    this.imagedata = undefined;

    this.center = {
      x:0,
      y:0
    };

    this.needsRedraw = false;
    this.shouldHandleRedrawLoop = false;
    this.onAnimFrame = ()=>{
      if (this.shouldHandleRedrawLoop) {
        if (this.needsRedraw) {
          this.render();
        }
        window.requestAnimationFrame(this.onAnimFrame);
      }
    }
  }
  /**Add a color
   * @param {WheelColor} c
   * @returns {ColorWheel} self
   */
  addColor(c) {
    this.colors.push(c);
    this.markRedraw();
    return this;
  }
  /**Remove a color by its instance reference
   * @param {WheelColor} c
   * @returns {ColorWheel} self
   */
  removeColor(c) {
    let ind = this.colors.indexOf(c);
    if (ind === -1) throw "Color not in colors";
    this.removeColorByIndex(ind);
    this.markRedraw();
    return this;
  }
  /**Remove a color by its index
   * @param {number} index
   * @returns {ColorWheel} self
   */
  removeColorByIndex(index) {
    this.colors.splice(index, 1);
    this.markRedraw();
    return this;
  }
  /**Tell the wheel to handle its own resizing
   * This will cause resize when window fires resize event
   * @returns {ColorWheel} self
   */
  handleResize() {
    on(window, "resize", () => this.onResize());
    return this;
  }
  /**Tell the wheel to handle its own redraw loop
   * This will cause redraw when functions invoked that call markRedraw:
   * addColor, removeColor, etc
   * @returns {ColorWheel} self
   */
  handleRedrawLoop() {
    this.shouldHandleRedrawLoop = true;
    window.requestAnimationFrame(this.onAnimFrame);
    return this;
  }
  fillParentSize() {
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.onResize();
    return this;
  }
  markRedraw() {
    this.needsRedraw = true;
    return this;
  }
  clearRedraw() {
    this.needsRedraw = false;
    return this;
  }
  /**Recalculates the image data
   * Will notify renderer that redraw needs to happen
   * @returns {ColorWheel} self
   */
  onResize() {
    this.element.width = Math.floor(this.rect.width);
    this.element.height = Math.floor(this.rect.height);
    this.imagedata = new ImageData(this.element.width, this.element.height);
    this.center.x = this.imagedata.width/2;
    this.center.y = this.imagedata.height/2;
    this.markRedraw();
    return this;
  }
  /**Set a pixel on the canvas at rgb offset index
   * @param {number} ind 
   * @param {number} r 
   * @param {number} g 
   * @param {number} b
   * @returns {ColorWheel} self
   */
  setPixelAtIndex(ind, r, g, b) {
    this.imagedata.data[ind + 0] = Math.floor(r);
    this.imagedata.data[ind + 1] = Math.floor(g);
    this.imagedata.data[ind + 2] = Math.floor(b);
    this.imagedata.data[ind + 3] = 255; //Full alpha
    return this;
  }
  /**Set a pixel on the canvas at xy position
   * @param {number} x 
   * @param {number} y 
   * @param {number} r 
   * @param {number} g 
   * @param {number} b 
   */
  setPixelAtXY(x, y, r, g, b) {
    let ind = Utils.TwoDimToIndex(x, y, this.imagedata.width)*4;
    this.setPixelAtIndex(ind, r, g, b);
    return this;
  }
  /**Set a color on the canvas at xy position
   * @param {number} x 
   * @param {number} y 
   * @param {WheelColor} c
   * @return {ColorWheel} self
   */
  setColorAtXY(x, y, c) {
    this.setPixelAtXY(x, y, c.r, c.g, c.b);
  }
  /**Get the leftmost edge of the pie slice
   * @param {number} theta in radians
   * @returns {number} an index in this.colors
   */
  getPieEdgeLeft(theta) {
    return this.getValidPieEdge(Math.floor(
      lerp(
        0,
        this.colors.length-1,
        theta / (Math.PI * 2)
      )
    ));
  }
  /**Returns a valid index within this.colors
   * @param {number} invalidEdge
   * @returns {number}
   */
  getValidPieEdge (invalidEdge) {
    let result = invalidEdge % this.colors.length;
    if (result < 0) result = this.colors.length-result;
    return result;
  }
  /**Get the rightmost edge of the pie slice
   * @param {number} theta in radians
   * @returns {number} an index in this.colors
   */
  getPieEdgeRight(theta) {
    return this.getValidPieEdge(Math.ceil(
      lerp(
        0,
        this.colors.length-1,
        theta / (Math.PI*2)
      )
    ));
  }
  /**Get radian angle of point in canvas around center
   * @param {number} x 
   * @param {number} y
   * @return {number} radian angle
   */
  getAngleOfPoint(x, y) {
    return Math.atan2(
      y - this.center.y,
      x - this.center.x
    ) + (Math.PI * 2); //Get rid of negative rotations by adding 180deg
  }
  /**Internal, should not be called unless you know what you're doing
   * This will redraw the entire canvas
   */
  render() {
    this.clearRedraw();
    let left = 0, right = 1, theta = 0, d = 0, a = 0;

    let pieSliceArcAngle = (Math.PI*2) * (1 / this.colors.length);
    let currentArcAngle = 0;
    for (let x = 0; x < this.imagedata.width; x++) {
      for (let y = 0; y < this.imagedata.height; y++) {
        //Find out what slice (color) of the pie (wheel) we're in
        //Get the angle around the center
        theta = this.getAngleOfPoint(x, y);
        //Find the left edge color index
        left = this.getPieEdgeLeft(theta);
        //Find the right edge color index
        right = this.getPieEdgeRight(theta);
        //Calculate distance from center
        d = dist(x, y, this.imagedata.width/2, this.imagedata.height/2);

        //Where are we within the pie slice
        currentArcAngle = theta % pieSliceArcAngle;
        //Normalize to 0.0 thru 1.0
        a = currentArcAngle / pieSliceArcAngle;

        //Modify imagedata
        WheelColor.lerp(
          this.colors[left],
          this.colors[right],
          a,
          this.mixingColor
        );
        this.setColorAtXY(x, y, this.mixingColor);
      }
    }
    this.ctx.putImageData(this.imagedata, 0, 0);
  }
}
