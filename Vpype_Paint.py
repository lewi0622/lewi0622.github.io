import subprocess, os, glob, sys
from tkinter import *
from tkinter.filedialog import askopenfilename, askdirectory
import xml.etree.ElementTree as ET
import webbrowser

#Define a callback function
def callback(url):
   webbrowser.open_new_tab(url)


def run_vpypeline():
    window.quit()
    command = build_vpypeline(filename=input_file)
    print("Running: \n", command)
    subprocess.run(command)


def build_vpypeline(filename):
    #set output file
    file_parts = os.path.splitext(filename)
    output_file = file_parts[0] + "_PAINT" + file_parts[1]

    directory_name = os.path.dirname(sys.argv[0])

    #get folder location for dip files    
    dip_parent_path = askdirectory(title="Dip Folder", initialdir=f'{directory_name}\\images\\Dip_locations\\')
    dip_parent_path += "\\Dip_"
    #read command
    prefix = r"vpype read "

    args = f' forlayer lmove %_lid% 1 splitdist {split_dist_entry.get()}cm ' #separate into color layers and split distance based on input
    args += f' forlayer lmove %_lid% "%_lid*2%" read -l "%_lid*2-1%" {dip_parent_path}%_name%.svg end' #separate into split distance layers. This relies on Vpype spitting out layers named layer1 
    args += r' lmove all %_lid% name -l %_lid% "1_tray" color -l %_lid% %_color% end '

    args += r" write "

    return prefix + '"' + filename + '"' + args + '"' + output_file + '"'


initial_dir = os.path.expandvars(R"C:\Users\$USERNAME\Downloads")
list_of_files = glob.glob(initial_dir + r"\*.svg")
latest_file = max(list_of_files, key=os.path.getctime)

input_file = askopenfilename(title="Design File", initialdir=initial_dir, filetypes=(("SVG files","*.svg*"),("all files","*.*")), initialfile=latest_file)

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
    svg_height_inches = float(svg_height.replace("cm", ""))/2.54
else:   
    svg_height_inches = float(svg_height)/96

#tk widgets and window
current_row = 0#helper row var, inced every time used;

window = Tk()
title = Label(window, text="Vpype Paint", fg="blue", cursor="hand2")
title.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/cookbook.html#inserting-regular-dipping-patterns-for-plotting-with-paint"))
title.grid(row=current_row,column=0,columnspan=2)
current_row +=1 
dimensions = Label(window, text=f"Input file Width(in): {svg_width_inches}, Height(in): {svg_height_inches}").grid(row=current_row, column=0, columnspan=2)
current_row +=1 

split_dist_label = Label(window, text="Split Distance (cm)", fg="blue", cursor="hand2")
split_dist_label.bind("<Button-1>", lambda e: callback("https://vpype.readthedocs.io/en/latest/cookbook.html#splitting-layers-by-drawing-distance"))
split_dist_label.grid(row=current_row, column=0)

split_dist_entry = Entry(window)
split_dist_entry.insert(0,"10")
split_dist_entry.grid(row=current_row, column=1)
current_row +=1

confirm_button = Button(window, text="Confirm", command=run_vpypeline).grid(row=current_row, column=1)

window.mainloop()

