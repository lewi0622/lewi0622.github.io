import os
import pathlib

path = r"C:\Users\lewi0\Desktop\lewi0622.github.io"

#absolute paths
common = r"C:\Users\lewi0\Desktop\lewi0622.github.io\projects\Common"

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
    <script src="'''+rel_path.as_posix()+'''/p5.js"></script>
    <!-- Custom scripts -->
    <script src="'''+rel_path.as_posix()+'''/palettes.js"></script>
    <script src="'''+rel_path.as_posix()+'''/utils.js"></script>
    <script src="'''+rel_path.as_posix()+'''/shapes.js"></script>
    <!-- Frame capture lib for gifs/vids -->
    <script src="'''+rel_path.as_posix()+'''/CCapture.all.min.js"></script>
    <!-- p5.gui lib -->
    <script src="'''+rel_path.as_posix()+'''/p5.gui.js"></script>
    <script src="'''+rel_path.as_posix()+'''/quicksettings.js"></script>   
    <script src="https://unpkg.com/p5.js-svg@1.3.1"></script>
    <!-- Color Picker lib -->
    <link rel="stylesheet" href="https://unpkg.com/alwan/dist/css/alwan.min.css">
    <script src="https://unpkg.com/alwan/dist/js/alwan.min.js"></script>
    <!-- Global Stylesheet -->
    <link rel="stylesheet" type="text/css" href="'''+rel_path.as_posix()+'''/style.css">
    <meta charset="utf-8">

    </head>
    <body>
    <script src="sketch.js"></script>
    </body>
    </html>'''

    print("Overwriting" + f)
    with open(f, "w") as myfile:
        myfile.write(file_contents)
