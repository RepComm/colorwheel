
import { ColorWheel, WheelColor } from "./colorwheel/colorwheel.js";
import { get } from "./colorwheel/aliases.js";

let container = get("my-color-wheel-container");

//Create a wheel
let myWheel = new ColorWheel()
  //Add some colors (chainable ftw)
  .addColor(WheelColor.fromRGB(255, 0, 0))
  .addColor(WheelColor.fromRGB(0, 255, 0))
  .addColor(WheelColor.fromRGB(0, 0, 255))

  //Mount it to our container
  .mount( container )

  //Handle resizing and render automagically
  .handleResize()
  .handleRedrawLoop()
  .handleColorPicking()
  .on("color-pick", (color)=>{
    container.style["border-color"] = `rgb(${color.toString()})`;
  })

  //Applies 100% to width and height of canvas element
  .fillParentSize()

myWheel.render();