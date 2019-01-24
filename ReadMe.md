# ColorSync
A vanilla js/canvas arbitrary color gradient renderer/widget.

Purpose:
- Render color wheels
- Engine for advanced color picker projects I am working on
- Learning/fun/experience for me

```
<div id="colorwidget">
    <div id="colorwheel">
        <canvas id="canvas">

        </canvas>
        <canvas id="canvas0">

        </canvas>
    </div>
</div>
<script type="text/JavaScript" src="function_alias.js"></script>
<script type="text/JavaScript" src="math.js"></script>
<script type="text/JavaScript" src="colorsync.js"></script>

<script type="text/JavaScript">
//Get a canvas
let canv = get("canvas");
//Create a widget using the canvas
let cww = new ColorWheelWidget(canv);

//Get another canvas
let canv0 = get("canvas0");
//Create another widget using it
let cww0 = new ColorWheelWidget(canv0);

//Loop through all colors of second widget
for (let i=0; i<cww.colors.length; i++) {
    let c = cww0.colors[i];

    //Set random values for each channel
    c.r = Math.floor(Math.random()*100);
    c.g = Math.floor(Math.random()*100);
    c.b = Math.floor(Math.random()*255);
}
//Tell the widget to redraw pixels (addColor and removeColor member functions auto call this)
cww0.renderPixels();
</script>
</script>
```


[Live Demo](https://repcomm.github.io/colorsync/colorsync.html)

![Image](../master/example.png?raw=true)
