---
title: "Coloring by Drawing Order"
categories:
  - SVG Processing
tags:
  - Vpype
---

# Coloring by Drawing Order

In most of my digital designs (done in p5.js), I use the random function to assign colors for lines. I have a palette of pre-defined colors that I know work well together, and simply pick from that. Occasionally, I'll use noise values based on the X,Y coordinates of a given line/shape to determine it's color, this results in clumps of color that vary with the underlying noise values.

While plotting one of my [Flow Fields](https://lewistonface.com/design/flow-fields/), I realized on the last layer, that I really liked how it was looking with only partially coverage. The line sorting algorithm had picked out these big chunks of the deisgn, and resulted in some beautiful art!
<p align="center">
  <img src="https://lewistonface.com/assets/images/Partially_Finished_Plot.jpg" />
</p>


## Recoloring a multicolor design
This gave me an idea of how to color or re-color my designs, using Vpype's linesort algorithm as it's base. Here's the steps I came up with to try and recreate what had accidentally occured.
1. Post process the file with linesort
2. Take one color layer and split it into chunks (three in this example)
```bash
...
splitdist 20in \
forlayer \
lmove %_lid% "%_i%%3+1%" \
end \
...
```

Playing around with the number of layers and the split distance can give varying results, but the important thing is the lines are now grouped into layers based not on some random value, but by how close the start/end of the lines are

## Recoloring a single color design
Here's an example of using the above code to recolor a single-color flow field design into pleasing clumps of color.

### Base design:
<p align="center">
  <img src="https://lewistonface.com/assets/images/Single_Color_Flow_Field.png" />
</p>

### Design if there to use random CMY colors:
<p align="center">
  <img src="https://lewistonface.com/assets/images/Flow_Field_CMY.png" />
</p>

### Design after using linesort and splitdist:
<p align="center">
  <img src="https://lewistonface.com/assets/images/Flow_Field_linesort_splitdist.png" />
</p>

While both look nice, I like the grouping provided by the linesort/splitdist a little more, I think it looks more organic and adds to the flowy nature of the design. 