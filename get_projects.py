import os

def find_folders_with_files(directory):
    folders_with_files = []

    def search_folders(current_path):
        files = os.listdir(current_path)

        if 'index.html' in files and 'sketch.js' in files:
            rel_path = os.path.relpath(current_path, directory)
            path = os.path.join(rel_path, "index.html?controls=true")
            folders_with_files.append(path)

        for file in files:
            file_path = os.path.join(current_path, file)
            if os.path.isdir(file_path):
                search_folders(file_path)

    search_folders(directory)
    return folders_with_files

def write_js_array(file_path, py_list):
    try:
        with open(file_path, 'w') as js_file:
            js_file.write('const all_projects_rel_paths = ' + str(py_list) + ';')
        print(f"JavaScript file '{file_path}' has been successfully written.")
    except Exception as e:
        print(f"Error occurred while writing JavaScript file: {e}")


path = os.getcwd()
result = find_folders_with_files(path)

write_js_array("all_projects.js", result)