---
title: "Plotter Post Processing"
categories:
  - SVG Processing
tags:
  - Vpype
  - Plotter-Post-Processing
---

# My application!
I've been slowly building out a GUI that aids in quickly and easily processing svgs for plotting. It uses [Vpype](https://github.com/abey79/vpype) to actually do the processing, but wraps many Vpype functions up in easy to use GUIs.

## Why?
The main reason I created this is because I typically use a lot of the same Vpype commmands for every file, and I have defaults set so that I usually don't have to do much of anything except to hit the "Confirm" button. 

### Why else?
The other reasons that have become clear over time are that Vpype is difficult to craft complex recipes by hand, and having a script that creates the code is a lot simpler in the long haul. Doing things like adding in dipping patterns becomes trivial when presented with a few simple checkbox/dropdown options. 

## Where?
The code can be found at my [github repo](https://github.com/lewi0622/Plotter-Post-Processing). I'm still in the process of updating and improving it, and I plan to do separate blog posts for the different utilities. So keep an eye out.