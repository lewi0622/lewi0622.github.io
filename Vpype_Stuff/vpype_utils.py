import os, glob, sys
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

    svg_width_inches = round(svg_width_inches * 1000)/1000
    svg_height_inches = round(svg_height_inches * 1000)/1000

    return svg_width_inches, svg_height_inches


def get_files():
    initial_dir = os.path.expandvars(R"C:\Users\$USERNAME\Downloads")
    list_of_files = glob.glob(initial_dir + r"\*.svg")
    latest_file = max(list_of_files, key=os.path.getctime)

    return askopenfilenames(initialdir=initial_dir, filetypes=(("SVG files","*.svg*"),("all files","*.*")), initialfile=latest_file)


def max_colors_per_file(input_files):
    """Finds the max of distinct colors in any given file"""
    max_num_color = 0
    for input_file in input_files:
        color_dict = {}
        tree = ET.parse(input_file)
        root = tree.getroot()
        for child in root:
            if "stroke" in child.attrib:
                color_dict[child.attrib["stroke"]] = 0
        if len(color_dict) > max_num_color:
            max_num_color = len(color_dict)
    return max_num_color


def get_directory_name(file_name):
    if sys.argv[0] == "file_name":
        return os.getcwd()
    else:
        return os.path.dirname(sys.argv[0])