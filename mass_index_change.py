import os
import pathlib

path = os.getcwd()

#absolute paths
common = path + r"\projects\Common"

to_replace = []

#find all index.html files that exist in folder
for root, dirs, files in os.walk(path):
    for f in files:
        #verify they reside along with a sketch.js
        if f == "index.html" and os.path.exists(os.path.join(root, "sketch.js")):
            to_replace.append(os.path.join(root, f))


for f in to_replace:
    rel_path = os.path.relpath(common, os.path.dirname(f))
    rel_path = pathlib.Path(rel_path)
    
    file_contents = '''<!DOCTYPE html><html lang="en"><head>
    <script src="'''+rel_path.as_posix()+'''/p5.min.js"></script>
    <!-- Perlin and Simplex Noise functions -->
    <script src="'''+rel_path.as_posix()+'''/perlin.js"></script>
    <!-- Custom scripts -->
    <script src="'''+rel_path.as_posix()+'''/palettes.js"></script>
    <script src="sketch.js"></script>
    <script src="'''+rel_path.as_posix()+'''/utils.js"></script>
    <script src="'''+rel_path.as_posix()+'''/cutouts.js"></script>    
    <script src="'''+rel_path.as_posix()+'''/shapes.js"></script>
    <script src="'''+rel_path.as_posix()+'''/midi.js"></script>
    <!-- Frame capture lib for gifs/vids -->
    <script src="'''+rel_path.as_posix()+'''/CCapture.all.min.js"></script>
    <!-- p5.gui lib -->
    <script src="'''+rel_path.as_posix()+'''/p5.gui.js"></script>
    <script src="'''+rel_path.as_posix()+'''/quicksettings.js"></script>   
    <script src="'''+rel_path.as_posix()+'''/p5.svg.js"></script>   
    <!-- Pen Size Files for Plotting -->
    <script src="'''+rel_path.as_posix()+'''/pen_utils.js"></script>
    <!-- Color Picker lib -->
    <link rel="stylesheet" href="'''+rel_path.as_posix()+'''/Alwan_Color_Picker/css/alwan.min.css">
    <script src="'''+rel_path.as_posix()+'''/Alwan_Color_Picker/js/alwan.min.js"></script>
    <!-- Open Type js library for svg handling of text -->
    <script src="https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"></script>
    <!-- Global Stylesheet -->
    <link rel="stylesheet" type="text/css" href="'''+rel_path.as_posix()+'''/style.css">
    <meta charset="utf-8">

    </head>
    <body>
    </body>
    </html>'''

    print("Overwriting" + f)
    with open(f, "w") as myfile:
        myfile.write(file_contents)
