import subprocess, os, glob
from tkinter import *
from tkinter.filedialog import askopenfilenames
import xml.etree.ElementTree as ET
import webbrowser
import vpype_cli as vp

#Define a callback function
def callback(url):
   webbrowser.open_new_tab(url)


def run_vpypeline():
    window.quit()
    for filename in input_files:
        command = build_vpypeline(filename=filename, show=False)
        print("Running: \n", command)
        vp.execute(command)
        if paint.get():
            subprocess.run("python C:\\Users\\lewi0\\Desktop\\lewi0622.github.io\\Vpype_Paint.py")

def show_vpypeline():
    show=True
    command = build_vpypeline(filename=input_files[0], show=show)
    print("Showing: \n", command)
    vp.execute(command)


def build_vpypeline(filename, show):
    #set output file
    file_parts = os.path.splitext(filename)
    output_file = file_parts[0] + "_PROCESSED" + file_parts[1]

    #read command
    prefix = r"read "

    # conserve stroke colors\
    if read_id.get():
        prefix += r" -a id  "

    # alwasy no crop, and execute crop command separately
    prefix += r" --no-crop "

    args = ""

    #occult function uses most recently drawn closed shapes to erase lines that are below the shape
    # the flag -i ignores layers and occults everything
    if occult.get():
        args += r" occult "
        if occult_ignore.get():
            args += r" -i "
        elif occult_accross.get():
            args += r" -a "
        if occult_keep_lines.get():
            args += r" -k "

    # read flag: doesn't crop incoming picture
    if crop.get():
        args += f" crop 0 0 {svg_width_inches}in {svg_height_inches}in"

    if scale_option.get():
        args += f" scaleto {scale_width_entry.get()}in {scale_height_entry.get()}in "
    if rotate_entry.get() != 0:
        args += f" rotate {rotate_entry.get()} "
 
    #layout as letter centers graphics within given page size
    if layout.get():
        args += r" layout "
        if layout_landscape.get():
            args += r" -l "
        args += f" {layout_width_entry.get()}x{layout_height_entry.get()}in "

    if linemerge.get():
        args += f" linemerge "
        if linemerge_tolerance.get() != "0.001968504":
            args += f" -t {linemerge_tolerance.get()} "

    if linesort.get():
        args += r" linesort "

    if reloop.get():
        args += r" reloop "  

    if linesimplify.get():
        args += f" linesimplify "
        if linesimplify_tolerance.get() != "0.001968504":
            args += f" -t {linesimplify_tolerance.get()} "

    if show:
        args += r" show "

        return prefix + '"' + filename + '"' + args
    else:
        args += r" write "
        if color_mode.get():
            args += r" --color-mode stroke "
        return prefix + '"' + filename + '"' + args + '"' + output_file + '"'


initial_dir = r"C:\Users\lewi0\Downloads"
list_of_files = glob.glob(initial_dir + r"\*.svg")
latest_file = max(list_of_files, key=os.path.getctime)

input_files = askopenfilenames(initialdir=initial_dir, filetypes=(("SVG files","*.svg*"),("all files","*.*")), initialfile=latest_file)

input_file = input_files[0]

#get svg size
with open(input_file, "r") as svg_file:
    tree = ET.parse(svg_file)
    root = tree.getroot()
    svg_width = root.attrib["width"] #size in pixels, css units are 96 px = 1 inch 
    svg_height = root.attrib["height"] 
    svg_viewbox = root.attrib["viewBox"]
    svg_viewbox = svg_viewbox.split(" ")

if "in" in svg_width:
    svg_width_inches = svg_width.replace("in", "")
elif "px" in svg_width:
    svg_width_inches = float(svg_width.replace("px", ""))/96 
elif "cm" in svg_width:
    svg_width_inches = float(svg_width.replace("cm", ""))/2.54
elif "%" in svg_width:
    svg_width_inches = float(svg_viewbox[2])/96
else:
    svg_width_inches = float(svg_width)/96 

if "in" in svg_height:
    svg_height_inches = svg_height.replace("in", "")
elif "px" in svg_height:
    svg_height_inches = float(svg_height.replace("px", ""))/96 
elif "cm" in svg_height:
    svg_height_inches = float(svg_height.replace("cm", ""))/2.54
elif "%" in svg_height:
    svg_height_inches = float(svg_viewbox[3])/96
else:   
    svg_height_inches = float(svg_height)/96

#tk widgets and window
current_row = 0#helper row var, inced every time used;

window = Tk()
title = Label(window, text="Vpype Options", fg="blue", cursor="hand2")
title.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/index.html"))
title.grid(row=current_row,column=0,columnspan=2)
current_row +=1 
dimensions = Label(window, text=f"Input file Width(in): {svg_width_inches}, Height(in): {svg_height_inches}").grid(row=current_row, column=0, columnspan=2)
current_row +=1 

read_id_label = Label(window, text="Preserve Colors using ID")
read_id_label.grid(row=current_row, column=0)

read_id = IntVar(value=1)
read_id_button = Checkbutton(window, text="--attr id", variable=read_id).grid(row=current_row, column=1)
current_row +=1 

occult_label = Label(window, text="Remove occluded geometries", fg="blue", cursor="hand2")
occult_label.bind("<Button-1>", lambda e: callback("https://github.com/LoicGoulefert/occult"))
occult_label.grid(row=current_row, column=0, columnspan=2)
current_row += 1 
occult = IntVar(value=0)
occult_button = Checkbutton(window, text="Occult", variable=occult).grid(row=current_row, column=0)
occult_keep_lines = IntVar(value=0)
occult_keep_lines_button = Checkbutton(window, text="Keep occulted lines", variable=occult_keep_lines).grid(row=current_row, column=1)
current_row +=1 
occult_ignore = IntVar(value=1)
occult_ignore_button = Checkbutton(window, text="Occult ignores Layers", variable=occult_ignore).grid(row=current_row, column=0)
occult_accross = IntVar(value=0)
occult_accross_button = Checkbutton(window, text="Occult accross layers, not within", variable=occult_accross).grid(row=current_row, column=1)
current_row +=1 

crop_label = Label(window, text="Crop to above dimensions on read", fg="blue", cursor="hand2")
crop_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#cmdoption-read-c"))
crop_label.grid(row=current_row,column=0)
crop = IntVar(value=1)
crop_button = Checkbutton(window, text="Crop input", variable=crop).grid(row=current_row,column=1)
current_row +=1 

scale_label = Label(window, text="Scale options (default: input file size)", fg="blue", cursor="hand2")
scale_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#scaleto"))
scale_label.grid(row=current_row, column=0)
scale_option = IntVar(value=1)
scale_button = Checkbutton(window, text="Scale?", variable=scale_option).grid(row=current_row,column=1)
current_row +=1 
scale_width_label = Label(window, text="Width Scale to (inches):").grid(row=current_row, column=0)
scale_height_label = Label(window, text="Height Scale to (inches):").grid(row=current_row, column=1)

current_row +=1 
scale_width_entry = Entry(window)
scale_width_entry.insert(0,f"{svg_width_inches}")
scale_width_entry.grid(row=current_row, column=0)

scale_height_entry = Entry(window)
scale_height_entry.insert(0,f"{svg_height_inches}")
scale_height_entry.grid(row=current_row, column=1)
current_row +=1 

rotate_label = Label(window, text="Rotate Clockwise", fg="blue", cursor="hand2")
rotate_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#rotate"))
rotate_label.grid(row=current_row, column=0)
rotate_entry = Entry(window)
if svg_width_inches < svg_height_inches:
    rotate_entry.insert(0, "90") 
else:
    rotate_entry.insert(0, "0") 
rotate_entry.grid(row=current_row, column=1)
current_row +=1 

layout_label = Label(text="Layout(centers scaled design in page size)", fg="blue", cursor="hand2")
layout_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#layout"))
layout_label.grid(row=current_row, column=0)
layout = IntVar(value=1)
layout_button = Checkbutton(window, text="Layout?", variable=layout).grid(row=current_row, column=1)
current_row +=1 

layout_width_label = Label(window, text="Page Layout Width(inches):").grid(row=current_row, column=0)
layout_height_label = Label(window, text="Page Layout Height(inches):").grid(row=current_row, column=1)

current_row +=1 
layout_width_entry = Entry(window)
layout_width_entry.insert(0,f"8.5")
layout_width_entry.grid(row=current_row, column=0)

layout_height_entry = Entry(window)
layout_height_entry.insert(0,f"11")
layout_height_entry.grid(row=current_row, column=1)
current_row +=1 

layout_landscape_label = Label(window, text="By default, the larger layout size is assumed to\n be the height Landscape flips the orientation")
layout_landscape_label.grid(row=current_row, column=0)
layout_landscape = IntVar(value=1)
layout_landscape_button = Checkbutton(window, text="Landscape", variable=layout_landscape)
layout_landscape_button.grid(row=current_row, column=1)
current_row +=1 

linemerge_label = Label(window, text="Merge Lines with overlapping line endings", fg="blue", cursor="hand2")
linemerge_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linemerge"))
linemerge_label.grid(row=current_row, column=0)
linemerge = IntVar(value=1)
linemerge_button = Checkbutton(window, text="linemerge", variable=linemerge).grid(row=current_row, column=1)
current_row +=1 
linemerge_tolerance_label = Label(window, text="Linemerge tolerance (inches) to merge lines").grid(row=current_row, column=0)
linemerge_tolerance = Entry(window)
linemerge_tolerance.insert(0, "0.001968504")
linemerge_tolerance.grid(row=current_row, column=1)
current_row +=1 

linesort_label = Label(window, text="Sort Lines", fg="blue", cursor="hand2")
linesort_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linesort"))
linesort_label.grid(row=current_row, column=0)
linesort = IntVar(value=1)
linesort_button = Checkbutton(window, text="linesort", variable=linesort).grid(row=current_row, column=1)
current_row +=1 

reloop_label = Label(window, text="Randomize seam location on closed paths", fg="blue", cursor="hand2")
reloop_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#reloop"))
reloop_label.grid(row=current_row, column=0)
reloop = IntVar(value=1)
reloop_button = Checkbutton(window, text="reloop", variable=reloop).grid(row=current_row, column=1)
current_row +=1 

linesimplify_label = Label(window, text="Reduce geometry complexity", fg="blue", cursor="hand2")
linesimplify_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linesimplify"))
linesimplify_label.grid(row=current_row, column=0)
linesimplify = IntVar(value=1)
linesimplify_button = Checkbutton(window, text="linesimplify", variable=linesimplify).grid(row=current_row, column=1)
current_row +=1 
linesimplify_tolerance_label = Label(window, text="Linesimplify tolerance (inches) to simplify geometries").grid(row=current_row, column=0)
linesimplify_tolerance = Entry(window)
linesimplify_tolerance.insert(0, "0.001968504")
linesimplify_tolerance.grid(row=current_row, column=1)
current_row +=1 

color_mode = IntVar()
color_mode_button = Checkbutton(window, text="Order by color (will overwrite colors)", variable=color_mode).grid(row=current_row, column=0, columnspan=2)
current_row +=1 

paint = IntVar(value=0)
if len(input_files) == 1:
    paint_label = Label(window, text="Run Paint after").grid(row=current_row, column=0)
    paint_button = Checkbutton(window, text="Paint", variable=paint).grid(row=current_row, column=1)
    current_row +=1

show_button = Button(window, text="Show Output", command=show_vpypeline).grid(row=current_row, column=0)
if len(input_files)>1:
    confirm_button = Button(window, text="Apply to All", command=run_vpypeline).grid(row=current_row, column=1)
else:
    confirm_button = Button(window, text="Confirm", command=run_vpypeline).grid(row=current_row, column=1)

window.mainloop()

