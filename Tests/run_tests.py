import os
from compare_imgs import compare
from scrape import browse_all

#generating imgs
# ?colors=3&controls=full&scale=1
# &bleed=0.25
# &cut=true
# &dpi=200


#globals
imgs_rel_path = r"imgs/"
project_list = []
param_list = []
img_names = []
num_pass = 0
num_fail = 0

def get_imgs(path, ends_with):
    # get all image pairs in imgs folder
    imgs_list = []
    for file in os.listdir(path):
        if file.endswith(ends_with):
            imgs_list.append(path+file)
    return imgs_list

# find all pre-populated png files to compare against
imgs = get_imgs(imgs_rel_path, ".png")

for img in imgs:
    # find full image name
    _root, img_name = img.removesuffix(".png").split("/")

    # we have to assume seed is first here to make the best guess at the project name
    project_name = img_name[:img_name.find("_seed")]
    parameters = {'seed': -1, 'colors':-1, 'scale': -1, 'bleed':"false", 'dpi':"300", 'cut':"false", 'controls':'full'}
    for param in parameters:
        #using the parametrs dict, parse out the values from the img name
        idx = img_name.find(param)
        if idx != -1:
            try:
                val, _x = img_name[idx+len(param)+1:].split("_",1)
            except ValueError:
                # last value only has one output
                val = img_name[idx+len(param)+1:]
            parameters[param] = val
    project_list.append(project_name)
    param_list.append(parameters)
    img_names.append(img)

# browse to and save imgs from each project with given parameters
browse_all(project_list, param_list, img_names)

# find all images, both prepopulated and newly saved
imgs = get_imgs(imgs_rel_path, ".png")

# if number of images is not even, report failure
if len(imgs)%2 != 0:
    print("ERROR: Odd number of images present")

# check if file 0+n, 1+n are the same name with " (1)" appended to the first,
for download, original in zip(imgs[::2],imgs[1::2]):
    print("Comparing :", original)
    if original == download.replace(" (1)",""):
        result = compare(download, original)
        if result == 0:
            num_pass += 1
        if result == 1:
            num_fail += 1
    else:
        print("ERROR: Names do not match. Original: ", original, " Download: ", download)

#cleanup downloaded files
imgs = get_imgs(imgs_rel_path, " (1).png")
for img in imgs:
    print("Removing: ", img)
    os.remove(img)

print("Total Failures: ", num_fail, "\n Total Passes: ", num_pass)