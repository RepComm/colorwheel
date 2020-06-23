
import { ColorWheel, WheelColor } from "./colorwheel/colorwheel.js";
import { get } from "./colorwheel/aliases.js";

//Create a wheel
let myWheel = new ColorWheel()
  //Add some colors (chainable ftw)
  .addColor(WheelColor.fromRGB(255, 0, 0))
  .addColor(WheelColor.fromRGB(0, 255, 0))
  .addColor(WheelColor.fromRGB(0, 0, 255))

  //Mount it to our container
  .mount(get("my-color-wheel-container"))

  //Handle resizing and render automagically
  .handleResize()
  .handleRedrawLoop()

  //Applies 100% to width and height of canvas element
  .fillParentSize();

console.log(myWheel);
myWheel.render();