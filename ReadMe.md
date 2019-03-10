# ColorSync
A vanilla js/canvas arbitrary color gradient renderer/widget.

Purpose:
- Render color wheels
- Engine for advanced color picker projects I am working on
- Learning/fun/experience for me

![Image](../master/example.png?raw=true)

```javascript
<div id="colorwidget">
    <div id="colorwheel">
        <canvas id="canvas">

        </canvas>
    </div>
</div>
<script type="text/JavaScript" src="function_alias.js"></script>
<script type="text/JavaScript" src="math.js"></script>
<script type="text/JavaScript" src="colorwheel.js"></script>

<script type="text/JavaScript">
//Get a canvas
let canv = get("canvas");

//Create a widget using the canvas
let cww = new ColorWheelWidget(canv);

//Loop through colors
for (let i=0; i<cww.colors.length; i++) {
    let c = cww.colors[i];

    //Set random values for each channel
    c.r = Math.floor(Math.random()*100);
    c.g = Math.floor(Math.random()*100);
    c.b = Math.floor(Math.random()*255);
}
//Tell the widget to redraw pixels (addColor and removeColor member functions auto call this)
cww.renderPixels();
</script>
```

[Live Demo](https://repcomm.github.io/colorsync)

