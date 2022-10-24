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
prefix = r"vpype read --no-crop --attr stroke "
args = r" occult layout -l letter crop 0 0 11in 8.5in linemerge linesort reloop linesimplify write --color-mode layer "

full_cmd = prefix + '"' + input_file + '"' + args + '"' + output_file + '"'
subprocess.run(full_cmd)