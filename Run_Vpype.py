import subprocess, os, glob
from tkinter import *
from tkinter.filedialog import askopenfilenames
import xml.etree.ElementTree as ET
import webbrowser

#Define a callback function
def callback(url):
   webbrowser.open_new_tab(url)


def run_vpypeline():
    window.quit()
    for filename in input_files:
        command = build_vpypeline(filename=filename, show=False)
        print("Running: \n", command)
        subprocess.run(command)


def show_vpypeline():
    show=True
    command = build_vpypeline(filename=input_files[0], show=show)
    print("Showing: \n", command)
    subprocess.run(command)


def build_vpypeline(filename, show):
    #set output file
    file_parts = os.path.splitext(filename)
    output_file = file_parts[0] + "_PROCESSED" + file_parts[1]

    #read command
    prefix = r"vpype read "

    # conserve stroke colors\
    if read_stroke.get():
        prefix += r" -a stroke  "

    # read flag: doesn't crop incoming picture
    if not crop.get():
        prefix += r" --no-crop "

    #standard mat opening for an 8x10 artwork is 7.5x9.5, usually scale to something less
    args = ""
    if scale_option.get():
        args += f" scaleto {scale_width_entry.get()}in {scale_height_entry.get()}in "
    if rotate_entry.get() != 0:
        args += f" rotate {rotate_entry.get()} "

    #occult function uses most recently drawn closed shapes to erase lines that are below the shape
    # the flag -i ignores layers and occults everything
    if occult.get():
        args += r" occult "
        if occult_ignore.get():
            args += r" -i "
        elif occult_accross.get():
            args += r" -a "
 
    #layout as letter centers graphics within given page size
    args += r" layout "
    if(layout_landscape.get()):
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
tree = ET.parse(input_file)
root = tree.getroot()
svg_width = root.attrib["width"] #size in pixels, css units are 96 px = 1 inch 
svg_height = root.attrib["height"] 

if "in" in svg_width:
    svg_width_inches = svg_width.replace("in", "")
elif "px" in svg_width:
    svg_width_inches = float(svg_width.replace("px", ""))/96 
elif "cm" in svg_width:
    svg_width_inches = float(svg_width.replace("cm", ""))/2.54
else:
    svg_width_inches = float(svg_width)/96 

if "in" in svg_height:
    svg_height_inches = svg_height.replace("in", "")
elif "px" in svg_height:
    svg_height_inches = float(svg_height.replace("px", ""))/96 
elif "cm" in svg_height:
    print(svg_height.replace("cm", ""))
    svg_height_inches = float(svg_height.replace("cm", ""))/2.54
    print(svg_height_inches)
else:   
    svg_height_inches = float(svg_height)/96

#tk widgets and window
window = Tk()
title = Label(window, text="Vpype Options", fg="blue", cursor="hand2")
title.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/index.html"))
title.grid(row=0,column=0,columnspan=2)

dimensions = Label(window, text=f"Input file Width(in): {svg_width_inches}, Height(in): {svg_height_inches}").grid(row=1, column=0, columnspan=2)

read_stroke_label = Label(window, text="Preserve Colors", fg="blue", cursor="hand2")
read_stroke_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/cookbook.html#preserve-color-or-other-attributes-when-reading-svg"))
read_stroke_label.grid(row=2, column=0)
read_stroke = IntVar(value=1)
read_stroke_button = Checkbutton(window, text="--attr stroke", variable=read_stroke).grid(row=2, column=1)

crop_label = Label(window, text="Crop to above dimensions on read", fg="blue", cursor="hand2")
crop_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#cmdoption-read-c"))
crop_label.grid(row=3,column=0)
crop = IntVar()
crop_button = Checkbutton(window, text="Crop input", variable=crop).grid(row=3,column=1)

scale_label = Label(window, text="Scale options (default: input file size)", fg="blue", cursor="hand2")
scale_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#scaleto"))
scale_label.grid(row=4, column=0)
scale_option = IntVar(value=1)
scale_button = Checkbutton(window, text="Scale?", variable=scale_option).grid(row=4,column=1)
scale_width_label = Label(window, text="Width Scale to (inches):").grid(row=5, column=0)
scale_width_entry = Entry(window)
scale_width_entry.insert(0,f"{svg_width_inches}")
scale_width_entry.grid(row=6, column=0)

scale_height_label = Label(window, text="Height Scale to (inches):").grid(row=5, column=1)
scale_height_entry = Entry(window)
scale_height_entry.insert(0,f"{svg_height_inches}")
scale_height_entry.grid(row=6, column=1)

rotate_label = Label(window, text="Rotate Clockwise", fg="blue", cursor="hand2")
rotate_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#rotate"))
rotate_label.grid(row=7, column=0)
rotate_entry = Entry(window)
rotate_entry.insert(0, "0")
rotate_entry.grid(row=7, column=1)

layout_label = Label(text="Layout(centers scaled design in page size)", fg="blue", cursor="hand2")
layout_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#layout"))
layout_label.grid(row=8, column=0, columnspan=2)

layout_width_label = Label(window, text="Page Layout Width(inches):").grid(row=9, column=0)
layout_width_entry = Entry(window)
layout_width_entry.insert(0,f"8.5")
layout_width_entry.grid(row=10, column=0)

layout_height_label = Label(window, text="Page Layout Height(inches):").grid(row=9, column=1)
layout_height_entry = Entry(window)
layout_height_entry.insert(0,f"11")
layout_height_entry.grid(row=10, column=1)

layout_landscape_label = Label(window, text="By default, the larger layout size is assumed to\n be the height Landscape flips the orientation")
layout_landscape_label.grid(row=11, column=0)
layout_landscape = IntVar(value=1)
layout_landscape_button = Checkbutton(window, text="Landscape", variable=layout_landscape)
layout_landscape_button.grid(row=11, column=1)


occult_label = Label(window, text="Remove occluded geometries", fg="blue", cursor="hand2")
occult_label.bind("<Button-1>", lambda e: callback("https://github.com/LoicGoulefert/occult"))
occult_label.grid(row=12, column=0)
occult = IntVar(value=0)
occult_button = Checkbutton(window, text="Occult", variable=occult).grid(row=12, column=1)
occult_ignore = IntVar(value=1)
occult_ignore_button = Checkbutton(window, text="Occult ignores Layers", variable=occult_ignore).grid(row=13, column=0)
occult_accross = IntVar(value=0)
occult_accross_button = Checkbutton(window, text="Occult accross layers, not within", variable=occult_accross).grid(row=13, column=1)

linemerge_label = Label(window, text="Merge Lines with overlapping line endings", fg="blue", cursor="hand2")
linemerge_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linemerge"))
linemerge_label.grid(row=14, column=0)
linemerge = IntVar(value=1)
linemerge_button = Checkbutton(window, text="linemerge", variable=linemerge).grid(row=14, column=1)
linemerge_tolerance_label = Label(window, text="Linemerge tolerance (inches) to merge lines").grid(row=15, column=0)
linemerge_tolerance = Entry(window)
linemerge_tolerance.insert(0, "0.001968504")
linemerge_tolerance.grid(row=15, column=1)

linesort_label = Label(window, text="Sort Lines", fg="blue", cursor="hand2")
linesort_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linesort"))
linesort_label.grid(row=16, column=0)
linesort = IntVar(value=1)
linesort_button = Checkbutton(window, text="linesort", variable=linesort).grid(row=16, column=1)

reloop_label = Label(window, text="Randomize seam location on closed paths", fg="blue", cursor="hand2")
reloop_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#reloop"))
reloop_label.grid(row=17, column=0)
reloop = IntVar(value=1)
reloop_button = Checkbutton(window, text="reloop", variable=reloop).grid(row=17, column=1)

linesimplify_label = Label(window, text="Reduce geometry complexity", fg="blue", cursor="hand2")
linesimplify_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linesimplify"))
linesimplify_label.grid(row=18, column=0)
linesimplify = IntVar(value=1)
linesimplify_button = Checkbutton(window, text="linesimplify", variable=linesimplify).grid(row=18, column=1)
linesimplify_tolerance_label = Label(window, text="Linesimplify tolerance (inches) to simplify geometries").grid(row=19, column=0)
linesimplify_tolerance = Entry(window)
linesimplify_tolerance.insert(0, "0.001968504")
linesimplify_tolerance.grid(row=19, column=1)

color_mode = IntVar()
color_mode_button = Checkbutton(window, text="Order by color (will overwrite colors)", variable=color_mode).grid(row=20, column=0, columnspan=2)

#OUTPUT FILENAME, EDITABLE

show_button = Button(window, text="Show Output", command=show_vpypeline).grid(row=21, column=0)
if len(input_files)>1:
    confirm_button = Button(window, text="Apply to All", command=run_vpypeline).grid(row=21, column=1)
else:
    confirm_button = Button(window, text="Confirm", command=run_vpypeline).grid(row=21, column=1)

window.mainloop()

