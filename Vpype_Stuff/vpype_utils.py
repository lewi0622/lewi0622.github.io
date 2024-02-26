import os, glob
import xml.etree.ElementTree as ET
import webbrowser
from tkinter.filedialog import askopenfilenames

def open_url_in_browser(url):
   """Opens the given url in a new browser tab"""
   webbrowser.open_new_tab(url)


def get_svg_width_height(path):
    """get svg width and height in inches"""
    tree = ET.parse(path)
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

    return svg_width_inches, svg_height_inches


def get_files():
    initial_dir = os.path.expandvars(R"C:\Users\$USERNAME\Downloads")
    list_of_files = glob.glob(initial_dir + r"\*.svg")
    latest_file = max(list_of_files, key=os.path.getctime)

    return askopenfilenames(initialdir=initial_dir, filetypes=(("SVG files","*.svg*"),("all files","*.*")), initialfile=latest_file)