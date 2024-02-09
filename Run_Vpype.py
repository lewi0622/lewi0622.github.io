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

def callback(url):
   """callback function for weblinks"""
   webbrowser.open_new_tab(url)

def run_vpypeline():
    """calls vpype cli to process """
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
    """Runs given commands on first file, but only shows the output. Cleans up any Occult generated temp files."""
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
    """Loads file expecting ids for each line, in the order their drawn. Only performs Occult"""
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
    """Builds vpype command based on GUI selections"""
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
        if linemerge_tolerance_entry.get() != "0.001968504":
            args += f" -t {linemerge_tolerance_entry.get()} "

    if linesort.get():
        args += r" linesort "

    if reloop.get():
        args += r" reloop "  

    if linesimplify.get():
        args += f" linesimplify "
        if linesimplify_tolerance_entry.get() != "0.001968504":
            args += f" -t {linesimplify_tolerance_entry.get()} "

    if squiggle.get():
        args += f" squiggles "
        if squiggle_amplitude_entry.get() != "0.019685":
            args += f" -a {squiggle_amplitude_entry.get()} "
        if squiggle_period_entry.get() != "0.11811":
            args += f" -p {squiggle_period_entry.get()} "

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

def layout_selection_changed(event):
    """Event from changing the layout dropdown box, sets the width and height accordingly"""
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

def grid_page_size_selection_changed(event):
    """Event from changing the grid_page_size dropdown box, sets the width and height accordingly"""
    selection = grid_page_size_combobox.get()
    grid_page_width_entry.delete(0,END)
    grid_page_height_entry.delete(0,END)
    if selection == "Letter":
        grid_page_width_entry.insert(0,"8.5")
        grid_page_height_entry.insert(0,"11")
    elif selection == "A4":
        grid_page_width_entry.insert(0,"8.3")
        grid_page_height_entry.insert(0,"11.7")
    elif selection == "A3":
        grid_page_width_entry.insert(0,"11.7")
        grid_page_height_entry.insert(0,"16.5")
    elif selection == "A2":
        grid_page_width_entry.insert(0,"16.5")
        grid_page_height_entry.insert(0,"23.4")

def grid_row_col_changed(_1, _2, _3): #unused arguments from change event
    """Event from changing the number of rows or columns in the Grid section. Sets the Column and Row size accordingly"""
    cols = grid_col_entry.get()
    rows = grid_row_entry.get()
    width = grid_page_width_entry.get()
    height = grid_page_height_entry.get()

    try:
        cols = int(cols)
        rows = int(rows)
        width = float(width)
        height = float(height)
    except ValueError:
        return

    try:
        col_size = width/cols
        row_size = height/rows
    except ZeroDivisionError:
        return
    
    col_size = round((col_size * 100)) / 100
    row_size = round((row_size * 100)) / 100

    grid_col_size.config(text=str(col_size))
    grid_row_size.config(text=str(row_size))


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
elif "%" in svg_width: #Expects that the viewbox is using 96DPI
    svg_width_inches = float(svg_viewbox[2])/96
else:
    svg_width_inches = float(svg_width)/96 

if "in" in svg_height:
    svg_height_inches = svg_height.replace("in", "")
elif "px" in svg_height:
    svg_height_inches = float(svg_height.replace("px", ""))/96 
elif "cm" in svg_height:
    svg_height_inches = float(svg_height.replace("cm", ""))/2.54
elif "%" in svg_height: #Expects that the viewbox is using 96DPI
    svg_height_inches = float(svg_viewbox[3])/96
else:   
    svg_height_inches = float(svg_height)/96

#tk widgets and window
current_row = 0 #helper row var, inc-ed every time used;

window = Tk()
title = Label(window, text="Vpype Options", fg="blue", cursor="hand2")
title.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/index.html"))
title.grid(row=current_row,column=0)

Label(window, text=f"{len(input_files)} file(s) selected, Input file Width(in): {svg_width_inches}, Height(in): {svg_height_inches}").grid(row=current_row, column=1, columnspan=3)
current_row +=1 

ttk.Separator(window, orient='horizontal').grid(sticky="we", row=current_row, column=0, columnspan=4)
current_row += 1

occult_label = Label(window, text="Remove occluded geometries", fg="blue", cursor="hand2")
occult_label.bind("<Button-1>", lambda e: callback("https://github.com/LoicGoulefert/occult"))
occult_label.grid(row=current_row, column=0)
occult = IntVar(value=0)
Checkbutton(window, text="Occult", variable=occult).grid(sticky="w", row=current_row, column=1)
occult_keep_lines = IntVar(value=0)
Checkbutton(window, text="Keep occulted lines", variable=occult_keep_lines).grid(sticky="w", row=current_row, column=2)
current_row += 1 

occult_ignore = IntVar(value=1)
Checkbutton(window, text="Ignores Layers", variable=occult_ignore).grid(sticky="w", row=current_row, column=1)
occult_accross = IntVar(value=0)
Checkbutton(window, text="Occult accross layers,\nnot within", variable=occult_accross).grid(sticky="w", row=current_row, column=2)
current_row +=1 

ttk.Separator(window, orient='horizontal').grid(sticky="we", row=current_row, column=0, columnspan=4)
current_row += 1

crop_label = Label(window, text="Crop to above dimensions on read", fg="blue", cursor="hand2")
crop_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#cmdoption-read-c"))
crop_label.grid(row=current_row,column=0)
crop = IntVar(value=1)
Checkbutton(window, text="Crop input", variable=crop).grid(sticky="w", row=current_row,column=1)

scale_label = Label(window, text="Scale options\n(default: input file size)", fg="blue", cursor="hand2")
scale_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#scaleto"))
scale_label.grid(row=current_row, column=2)
scale_option = IntVar(value=1)
Checkbutton(window, text="Scale?", variable=scale_option).grid(sticky="w", row=current_row,column=3)
current_row +=1 
rotate_label = Label(window, text="Rotate Clockwise", fg="blue", cursor="hand2")
rotate_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#rotate"))
rotate_label.grid(row=current_row, column=0)
rotate_entry = Entry(window, width=7)
if float(svg_width_inches) < float(svg_height_inches) and float(svg_width_inches)<12:
    rotate_entry.insert(0, "90") #autoroate for small axidraw designs where the width is the long side
else:
    rotate_entry.insert(0, "0") 
rotate_entry.grid(sticky="w", row=current_row, column=1)

Label(window, text="Width Scale to (in):").grid(row=current_row, column=2)
scale_width_entry = Entry(window, width=7)
scale_width_entry.insert(0,f"{svg_width_inches}")
scale_width_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

Label(window, text="Height Scale to (in):").grid(row=current_row, column=2)
scale_height_entry = Entry(window, width=7)
scale_height_entry.insert(0,f"{svg_height_inches}")
scale_height_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

ttk.Separator(window, orient='horizontal').grid(sticky="we", row=current_row, column=0, columnspan=4)
current_row += 1

layout_label = Label(text="Layout centers scaled\ndesign in page size)", fg="blue", cursor="hand2")
layout_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#layout"))
layout_label.grid(row=current_row, column=0)
layout = IntVar(value=1)
Checkbutton(window, text="Layout?", variable=layout).grid(sticky="w", row=current_row, column=1)

Label(window, text="Page Layout Width(in):").grid(row=current_row, column=2)
layout_width_entry = Entry(window, width=7)
layout_width_entry.insert(0,f"8.5")
layout_width_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

Label(window, text="Page Size").grid(row=current_row, column=0)
layout_combobox = ttk.Combobox(
    width=7,
    state="readonly",
    values=["Letter", "A4", "A3", "A2"]
)
layout_combobox.current(0)
layout_combobox.grid(sticky="w", row=current_row, column=1)
layout_combobox.bind("<<ComboboxSelected>>", layout_selection_changed)

Label(window, text="Page Layout Height(in):").grid(row=current_row, column=2)
layout_height_entry = Entry(window, width=7)
layout_height_entry.insert(0,f"11")
layout_height_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1

layout_landscape_label = Label(window, text="By default, the larger layout size is the height,\nLandscape flips the orientation")
layout_landscape_label.grid(row=current_row, column=0, columnspan=2)
layout_landscape = IntVar(value=1)
Checkbutton(window, text="Landscape", variable=layout_landscape).grid(sticky="w", row=current_row, column=2)
current_row +=1 

ttk.Separator(window, orient='horizontal').grid(sticky="we", row=current_row, column=0, columnspan=4)
current_row += 1

linemerge_label = Label(window, text="Merge Lines with\noverlapping line endings", fg="blue", cursor="hand2")
linemerge_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linemerge"))
linemerge_label.grid(row=current_row, column=0)
linemerge = IntVar(value=1)
Checkbutton(window, text="linemerge", variable=linemerge).grid(sticky="w", row=current_row, column=1)
linemerge_tolerance_label = Label(window, text="Linemerge tolerance (in)").grid(row=current_row, column=2)
linemerge_tolerance_entry = Entry(window, width=7)
linemerge_tolerance_entry.insert(0, "0.0019")
linemerge_tolerance_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

linesort_label = Label(window, text="Sort Lines", fg="blue", cursor="hand2")
linesort_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linesort"))
linesort_label.grid(row=current_row, column=0)
linesort = IntVar(value=1)
Checkbutton(window, text="linesort", variable=linesort).grid(sticky="w", row=current_row, column=1)

reloop_label = Label(window, text="Randomize seam location\non closed paths", fg="blue", cursor="hand2")
reloop_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#reloop"))
reloop_label.grid(row=current_row, column=2)
reloop = IntVar(value=1)
Checkbutton(window, text="reloop", variable=reloop).grid(sticky="w", row=current_row, column=3)
current_row +=1 

linesimplify_label = Label(window, text="Reduce geometry complexity", fg="blue", cursor="hand2")
linesimplify_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#linesimplify"))
linesimplify_label.grid(row=current_row, column=0)
linesimplify = IntVar(value=1)
Checkbutton(window, text="linesimplify", variable=linesimplify).grid(sticky="w", row=current_row, column=1)
Label(window, text="Linesimplify tolerance (in)").grid(row=current_row, column=2)
linesimplify_tolerance_entry = Entry(window, width=7)
linesimplify_tolerance_entry.insert(0, "0.0019")
linesimplify_tolerance_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

squiggle_label = Label(window, text="Add squiggle filter", fg="blue", cursor="hand2")
squiggle_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#squiggles"))
squiggle_label.grid(row=current_row, column=0)
squiggle = IntVar(value=0)
Checkbutton(window, text="squiggle", variable=squiggle).grid(sticky="w", row=current_row, column=1)

Label(window, text="Amplitude of squiggle(in)").grid(row=current_row, column=2)
squiggle_amplitude_entry = Entry(window, width=7)
squiggle_amplitude_entry.insert(0, "0.0196")
squiggle_amplitude_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

Label(window, text="Period of squiggle(in)").grid(row=current_row, column=2)
squiggle_period_entry = Entry(window, width=7)
squiggle_period_entry.insert(0, "0.1181")
squiggle_period_entry.grid(sticky="w", row=current_row, column=3)
current_row +=1 

multipass_label = Label(window, text="Add multiple passes to all lines", fg="blue", cursor="hand2")
multipass_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/reference.html#multipass"))
multipass_label.grid(row=current_row, column=0)
multipass = IntVar(value=0)
Checkbutton(window, text="multipass", variable=multipass).grid(sticky="w", row=current_row, column=1)

separate_files_label = Label(window, text="Separate SVG Layers\ninto individual files", fg="blue", cursor="hand2")
separate_files_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/cookbook.html#saving-each-layer-as-a-separate-file"))
separate_files_label.grid(row=current_row, column=2)
separate_files = IntVar(value=0)
Checkbutton(window, text="forlayer", variable=separate_files).grid(sticky="w", row=current_row, column=3)
current_row += 1

ttk.Separator(window, orient='horizontal').grid(sticky="we", row=current_row, column=0, columnspan=4)
current_row += 1

grid_label = Label(window, text="Merge Multiple SVGs into Grid", fg="blue", cursor="hand2")
grid_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/cookbook.html#faq-merge-to-grid"))
grid_label.grid(row=current_row, column=0)

grid = IntVar(value=0)
Checkbutton(window, text="Grid", variable=grid).grid(sticky="w", row=current_row, column=1)

Label(window, text="Grid Page Size").grid(row=current_row, column=2)
grid_page_size_combobox = ttk.Combobox(
    width=7,
    state="readonly",
    values=["Letter", "A4", "A3", "A2"]
)
grid_page_size_combobox.current(0)
grid_page_size_combobox.grid(sticky="w", row=current_row, column=3)
grid_page_size_combobox.bind("<<ComboboxSelected>>", grid_page_size_selection_changed)
current_row +=1

Label(window, text="Grid Page Size Width(in):").grid(row=current_row, column=0)
grid_page_width_SV = StringVar()
grid_page_width_SV.trace_add("write", grid_row_col_changed)
grid_page_width_entry = Entry(window, textvariable=grid_page_width_SV, width=7)
grid_page_width_entry.grid(sticky="w", row=current_row, column=1)

Label(window, text="Grid Page Size Height(in):").grid(row=current_row, column=2)
grid_page_height_SV = StringVar()
grid_page_height_SV.trace_add("write", grid_row_col_changed)
grid_page_height_entry = Entry(window, textvariable=grid_page_height_SV, width=7)
grid_page_height_entry.grid(sticky="w", row=current_row, column=3)
current_row += 1 

Label(window, text="Grid Columns:").grid(row=current_row, column=0)
grid_col_SV = StringVar()
grid_col_SV.trace_add("write", grid_row_col_changed)
grid_col_entry = Entry(window, textvariable=grid_col_SV, width=7)
grid_col_entry.grid(sticky="w", row=current_row, column=1)

Label(window, text="Grid Rows:").grid(row=current_row, column=2)
grid_row_SV = StringVar()
grid_row_SV.trace_add("write", grid_row_col_changed)
grid_row_entry = Entry(window, textvariable=grid_row_SV, width=7)
grid_row_entry.grid(sticky="w", row=current_row, column=3)
current_row += 1 

Label(window, text="Column Size (in):").grid(row=current_row, column=0)
grid_col_size = Label(window, text="default")
grid_col_size.grid(sticky="w", row=current_row, column=1)

Label(window, text="Row Size (in):").grid(row=current_row, column=2)
grid_row_size = Label(window, text="default")
grid_row_size.grid(sticky="w", row=current_row, column=3)
current_row += 1 

Label(window, text="Override colors per layer").grid(row=current_row, column=0)
override_colors = IntVar(value=0)
Checkbutton(window, text="-m layer", variable=override_colors).grid(sticky="w", row=current_row, column=1)
current_row += 1

# insert after creation of the size entries so
grid_page_width_entry.insert(0, "8.5")
grid_page_height_entry.insert(0, "11") 
grid_col_entry.insert(0, "1")
grid_row_entry.insert(0, "1")

ttk.Separator(window, orient='horizontal').grid(sticky="we", row=current_row, column=0, columnspan=4)
current_row += 1

paint = IntVar(value=0)
if len(input_files) == 1:
    Label(window, text="Run Paint after").grid(row=current_row, column=0)
    Checkbutton(window, text="Paint", variable=paint).grid(sticky="w", row=current_row, column=1)

Button(window, text="Show Output", command=show_vpypeline).grid(row=current_row, column=2)
if len(input_files)>1:
    Button(window, text="Apply to All", command=run_vpypeline).grid(row=current_row, column=3)
else:
    Button(window, text="Confirm", command=run_vpypeline).grid(row=current_row, column=3)

window.mainloop()

