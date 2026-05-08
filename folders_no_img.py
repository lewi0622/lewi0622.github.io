import os

folders = []
for root, dirs, files in os.walk("."):
    if "index.html" in files and "sketch.js" in files:
        has_img = any(f.endswith((".png", ".mp4")) for f in files)
        if not has_img:
            folders.append(root)

for folder in folders:
    print(folder)
