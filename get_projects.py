import os, json

base_path = r"https://lewi0622.github.io"

def find_folders_with_files(directory):
    folders_with_files = []

    def search_folders(current_path):
        files = os.listdir(current_path)
        thumbnail = False
        thumbnail_name = ""
        for file in files:
            if ".gif" in file or ".png" in file or ".mp4" in file:
                thumbnail = True
                thumbnail_name = file
        if thumbnail and 'index.html' in files and 'sketch.js' in files:
            rel_path = os.path.relpath(current_path, directory)
            iframe_path = os.path.join(base_path, rel_path, "index.html?controls=true")
            thumbnail_path = os.path.join(base_path, rel_path, thumbnail_name)
            folder_dict = {"iframe":iframe_path, "thumbnail": thumbnail_path}
            folders_with_files.append(folder_dict)

        for file in files:
            file_path = os.path.join(current_path, file)
            if os.path.isdir(file_path):
                search_folders(file_path)

    search_folders(directory)
    return folders_with_files

def write_js_array(file_path, py_list, array_name):
    try:
        with open(file_path, 'w') as js_file:
            js_file.write(f'const {array_name} = ' + json.dumps(py_list) + ';')
        print(f"JavaScript file '{file_path}' has been successfully written.")
    except Exception as e:
        print(f"Error occurred while writing JavaScript file: {e}")

def find_images_in_folder(file_path):
    image_list = []
    files = os.listdir(file_path)
    for file in files:
        image_list.append(os.path.join(base_path, file_path, file))
    return image_list

path = os.getcwd()
result = find_folders_with_files(path)

write_js_array("all_projects.js", result, "all_projects_full_paths")

plotter_portfolio_list = find_images_in_folder(os.path.join("assets", "images", "plotter_portfolio"))

write_js_array("plotter_portfolio.js", plotter_portfolio_list, "plotter_portfolio_full_paths")