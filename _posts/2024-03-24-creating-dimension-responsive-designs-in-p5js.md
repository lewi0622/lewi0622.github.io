---
title: "Creating Dimension Responsive Designs in p5.js"
categories:
  - Design
tags:
  - p5js
---

# Creating Dimension Responsive Designs in p5.js
For a long time now, I've used a custom scale factor which, applied to certain parameters, allows me to easily scale up/down a design to a desired resolution. But this always was under the assumption that the aspect ratio of the design (ratio of canvas width and height) would remain about the same.

For the most part, I've created square designs, and in doing so haven't always been great at differentiating between the width and height because it was always the same!

For the most part, I've created square designs, and in doing so haven't always been great at differentiating between the width and height because it was always the same!
Recently I introduced new parameters to my p5.js framework:
> smaller_base and larger_base:
> the unscaled pixel value of the smaller/larger canvas dimension

This requires a fundamental rethinking of how I design my sketches. For example, if I was to create a square centered in the canvas, I might say:
```javascript
  rectMode(CENTER);
  translate(width/2, height/2);
  square(0,0, width/2);
```
![Square_1_1_ratio]({{ site.url }}{{ site.baseurl }}/assets/images/Square_1_1_ratio.png)

You might say this is good enough! It changes when the design width changes, and always stays centered. But what if the aspect ratio goes from 1:1 to 4:1?
![Square_4_1_ratio]({{ site.url }}{{ site.baseurl }}/assets/images/Square_4_1_ratio.png)

Hmm, not really what we want out of this sketch, we wanted to see a square centered, and while that's technically still what's happening, the square is getting cut off. 

Let's add our new variables for smaller and larger base values in our setup function and assign them programmatically.
```javascript
let smaller_base, larger_base;
function setup() {
  const base_x = 400;
  const base_y = 100;
  createCanvas(base_x, base_y); 
  smaller_base = base_x;
  larger_base = base_y;
  if(smaller_base > larger_base){
    smaller_base = base_y;
    larger_base = base_x;
  }
}
```

Now how does that handle our 4:1 ratio?
![Square_4_1_ratio_fixed]({{ site.url }}{{ site.baseurl }}/assets/images/Square_4_1_ratio_fixed.png)

Much better, what about a 1:4 ratio?

![Square_1_4_ratio]({{ site.url }}{{ site.baseurl }}/assets/images/Square_1_4_ratio.png)

Perfect!

For me, this is going to require rewriting some of my earlier code, but it will be worth it when I want to generate a phone wallpaper from a square design, and not have to write code for specific size or ratio based contingencies.

See and edit the code used for this example [here](https://editor.p5js.org/lewi0622/sketches/DaXHaDd_9).