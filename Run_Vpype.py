import subprocess, os, glob
from tkinter import *
from tkinter import ttk
from tkinter.filedialog import askopenfilenames
import xml.etree.ElementTree as ET
import webbrowser
import vpype_cli as vp
import sys

if sys.argv[0] == "Run_Vpype.py":
    directory_name = os.getcwd()
else:
    directory_name = os.path.dirname(sys.argv[0])

#Define a callback function
def callback(url):
   webbrowser.open_new_tab(url)

def run_vpypeline():
    window.quit()
    for filename in input_files:
        file_parts = os.path.splitext(filename)
        output_file = file_parts[0] + "_PROCESSED" + file_parts[1]
        if occult.get():
            command = build_occult_pypeline(input_filename=filename, output_filename=output_file)
            print("Running: \n", command)
            vp.execute(command)
            command = build_vpypeline(input_filename=output_file, output_filename=output_file, show=False)
            print("Running: \n", command)
            vp.execute(command)
        else:
            command = build_vpypeline(input_filename=filename, output_filename=output_file, show=False)
            print("Running: \n", command)
            vp.execute(command)
        if paint.get():
            subprocess.run(f"python {directory_name}\\Vpype_Paint.py")

def show_vpypeline():
    file_parts = os.path.splitext(input_files[0])
    output_file = file_parts[0] + "_PROCESSED" + file_parts[1]
    if occult.get():
        command = build_occult_pypeline(input_filename=input_files[0], output_filename=output_file)
        print("Running: \n", command)
        vp.execute(command)
        command = build_vpypeline(input_filename=output_file, output_filename="", show=True)
        print("Showing: \n", command)
        vp.execute(command)
        os.remove(output_file)
    else:
        command = build_vpypeline(input_filename=input_files[0], output_filename="", show=True)
        print("Showing: \n", command)
        vp.execute(command)


def build_occult_pypeline(input_filename, output_filename):
    #read command with flags
    prefix = r"read -a id --no-crop "

    #occult function uses most recently drawn closed shapes to erase lines that are below the shape
    # the flag -i ignores layers and occults everything
    args = r" occult "
    if occult_ignore.get():
        args += r" -i "
    elif occult_accross.get():
        args += r" -a "
    if occult_keep_lines.get():
        args += r" -k "

    #write to temp file
    args += r" write "

    return prefix + '"' + input_filename + '"' + args + '"' + output_filename + '"'


def build_vpypeline(input_filename, output_filename, show):
    #read command
    prefix = r"read -a stroke "

    if not crop.get():
        prefix += r" --no-crop "

    args = ""

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

    if multipass.get():
        args += f" multipass "

    if show:
        args += r" show "

        return prefix + '"' + input_filename + '"' + args
    else:
        if separate_files.get():
            output_filename = output_filename.split(".svg")[0] + "%_lid%" +".svg"
            args += f' forlayer write "{output_filename}" end '
            return prefix + '"' + input_filename + '"' + args
        else:
            args += r" write "

            return prefix + '"' + input_filename + '"' + args + '"' + output_filename + '"'

def selection_changed(event):
    ###Event from changing the layout dropdown box, sets the width and height accordingly
    selection = layout_combobox.get()
    layout_width_entry.delete(0,END)
    layout_height_entry.delete(0,END)
    if selection == "Letter":
        layout_width_entry.insert(0,"8.5")
        layout_height_entry.insert(0,"11")
        layout.set(1)
    elif selection == "A4":
        layout_width_entry.insert(0,"8.3")
        layout_height_entry.insert(0,"11.7")
    elif selection == "A3":
        layout_width_entry.insert(0,"11.7")
        layout_height_entry.insert(0,"16.5")
    elif selection == "A2":
        layout_width_entry.insert(0,"16.5")
        layout_height_entry.insert(0,"23.4")
        layout.set(0)

initial_dir = os.path.expandvars(R"C:\Users\$USERNAME\Downloads")
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
    try:
        svg_viewbox = root.attrib["viewBox"] #ran into a few svgs that don't give a viewBox
    except:
        svg_viewbox = f"[0 0 {svg_width} {svg_height}]" #set viewbox to use width and height
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
if float(svg_width_inches) < float(svg_height_inches) and float(svg_width_inches)<12:
    rotate_entry.insert(0, "90") #autoroate for small axidraw designs where the width is the long side
else:
    rotate_entry.insert(0, "0") 
rotate_entry.grid(row=current_row, column=1)
current_row +=1 

layout_label = Label(text="Layout(centers scaled design in page size)", fg="blue", cursor="hand2")
layout_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#layout"))
layout_label.grid(row=current_row, column=0, columnspan=2)
current_row +=1 

layout_combobox = ttk.Combobox(
    state="readonly",
    values=["Letter", "A4", "A3", "A2"]
)
layout_combobox.current(0)
layout_combobox.grid(row=current_row, column=0)
layout_combobox.bind("<<ComboboxSelected>>", selection_changed)

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

multipass_label = Label(window, text="Add multiple passes to all lines", fg="blue", cursor="hand2")
multipass_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#multipass"))
multipass_label.grid(row=current_row, column=0)
multipass = IntVar(value=0)
multipass_button = Checkbutton(window, text="multipass", variable=multipass).grid(row=current_row, column=1)
current_row +=1

separate_files_label = Label(window, text="Seperate SVG Layers into individual files", fg="blue", cursor="hand2")
separate_files_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/cookbook.html#saving-each-layer-as-a-separate-file"))
separate_files_label.grid(row=current_row, column=0)
separate_files = IntVar(value=0)
separate_files_button = Checkbutton(window, text="Separate Files", variable=separate_files).grid(row=current_row, column=1)
current_row += 1

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

