---
title: "Flow Fields"
categories:
  - Design
tags:
  - p5js
---

# Flow Fields

<p align="center">
  <img src="https://lewistonface.com/assets/images/flow-fields/Flow_Field_20copy_seed_147274_colors_6_scale_1.png" />
</p>

Flow fields are two dimensional Perlin Noise fields, and to my mind, often considered passé in the generative art community. Perhaps because of that reason,  I've been avoiding them for some time. A while back I played with the flow field code from [The Coding Train](https://www.youtube.com/watch?v=BjoM9oKOAKY), but I never did much with it. 

<p align="center">
  <img src="https://lewistonface.com/assets/images/flow-fields/Flow_Field_20copy_seed_209131_colors_6_scale_1.png" />
</p>

With all the work I've been doing with Perlin Noise generally, something clicked with me and I understood how to make a flow field using my own code, and not with the templates I'd previously seen. It always makes more sense when you do it for yourself. 

<p align="center">
  <img src="https://lewistonface.com/assets/images/flow-fields/Flow_Field_20copy_seed_600582_colors_6_scale_1.png" />
</p>

My flow field code is simply rows/columnns of points, and then per point, a number of iterations move in the direction of the angle given from the noise field. These iterations are the vertices in each line. I experimented with random point placement, but enjoy the coverage of the grids/rows, and I could always offest those by a random displacment to make it less regular looking. 

<p align="center">
  <img src="https://lewistonface.com/assets/images/flow-fields/Flow_Field_20copy_seed_952611_colors_6_scale_1.png" />
</p>

Here's the first one I plotted, using Lyra Aqua Brush Duo watercolor markers on smooth bristol. 

<p align="center">
  <img src="https://lewistonface.com/assets/images/flow-fields/Flow-Field-Plotted.jpg" />
</p>

As per usual, you can find my code on [my github](https://github.com/lewi0622/lewi0622.github.io/blob/master/plotter_projects/Flow_Field/sketch.js). 