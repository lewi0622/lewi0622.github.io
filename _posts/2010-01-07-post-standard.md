---
title: "Post: Standard"
excerpt_separator: "<!--more-->"
categories:
  - Blog
tags:
  - Vpype
  - readability
  - standard
---


# Vpype Grid
I ran into an issue when implementing the [Grid](https://vpype.readthedocs.io/en/latest/reference.html#grid) command in [Vpype](https://github.com/abey79/vpype). When pulling in multiple files, it would often place them onto the same layers, thereby overwriting whatever color was assigned to that layer. In multi-color plots, this was a problem!
## Grid Recipe
Here's my solution for maintaining colors in a multi-color svg file when laying out on a grid. The gist of it is to place every layer of the incoming files on their own layers, so nothing gets combined or overwritten.
```bash
vpype \
eval "%layer_count=1%" \
eval "files=[r'Demo1.svg', r'Demo2.svg']" \
grid -o 4.25in 5.5in 2 1 \
	read -a stroke %files[_i]% \
	forlayer \
		lmove %_lid% %layer_count% \
		eval "%layer_count=layer_count+1%" \
	end \
end \
layout -l 8.5x11in \
show
```
### Recipe Breakdown
So let's walk through what's happening here, step by step.
1. eval "%layer_count=1%"
	1. layer_count is our loop variable, and since layer id values (lid) begin at 1, we'll start this at 1 as well.
2. eval "files...
	1. This describes the paths to our files. I typically use a python script to populate this line.
3. grid...
	1. We're using the -o offset flag to specify the size of each cell of the grid followed by the number of columns and rows. So in this case it's two columns, one row, with each grid is 4.25x5.5 inches. The total size, of the design is 8.5x11.
	2. The grid command is a type of [Block Processor](https://vpype.readthedocs.io/en/latest/fundamentals.html#block-processor-commands) meaning it automatically creates a loop and associated loop variables.
4. read...
	1. We're reading each file by accessing our files variable, at the index "\_i", which is the loop variable created by the grid command. We're parsing this incoming file based on it's stroke attribute using the -a flag. 
5. forLayer...
	1. Another [Block Processor](https://vpype.readthedocs.io/en/latest/fundamentals.html#block-processor-commands) command, this loops through every layer in the design we just read in.
6. lmove
	1. Here's where the magic happens. We move layer \_lid onto layer layer_count (our loop variable from above). This puts each layer read in on it's own separate layer.
7. eval "%layer_count=layer_count+1%"
	1. Increment the counter
8. layout
	1. Center the design created by the grid command on a 8.5x11" page