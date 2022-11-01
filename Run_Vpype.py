import subprocess, os, glob
import tkinter as tk
from tkinter.filedialog import askopenfilename

tk.Tk().withdraw()

initial_dir = r"C:\Users\lewi0\Downloads"
list_of_files = glob.glob(initial_dir + r"\*.svg")
latest_file = max(list_of_files, key=os.path.getctime)

input_file = askopenfilename(initialdir=initial_dir, filetypes=(("SVG files","*.svg*"),("all files","*.*")), initialfile=latest_file)

#set output file
file_parts = os.path.splitext(input_file)
output_file = file_parts[0] + "_PROCESSED" + file_parts[1]

#options and args
# crop 0 0 8in 10in can be placed after letter if need be

#read command
prefix = r"vpype read"

# read flag: doesn't crop incoming picture
prefix += r" --no-crop "

args = r""

# sclaing argument, uncomment which one is the preferred size
#standard mat opening
args += r" scaleto 8in 10in"
#slightly larger than mat opening, so edges aren't visible
# args += r" scaleto 8.5in 10.5in"
#full sized
# args += r" scaleto 8.5in 11in"

#occult function uses most recently drawn closed shapes to erase lines that are below the shape
args += r" occult "

#layout as letter centers graphics within a letter size, but does not scale it
args += r"layout -l letter "

#linemerge connects start/ends of shapes. linesort sorts for plotting pendown time. 
# reloop randomizes starts ends of closed shapes to reduce alignment of up/down marks. linesimplify changes curves to polygons for better plotter control
#still need to check on color-mode-layer
args += r" linemerge linesort reloop linesimplify write --color-mode layer "
print(args)
full_cmd = prefix + '"' + input_file + '"' + args + '"' + output_file + '"'
subprocess.run(full_cmd)