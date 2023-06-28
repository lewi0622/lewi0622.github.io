import cv2
from os.path import exists

def compare(img_path1, img_path2):
    for path in [img_path1, img_path2]:
        if not exists(path):
            print("Path does not exist: ", path)
            return 1
    a = cv2.imread(img_path1)
    b = cv2.imread(img_path2)
    
    # get height and width and assume it's the same as img b
    h, w, _c = a.shape

    #compare with norm func
    errorL2 = cv2.norm(a, b, cv2.NORM_L2)
    similarity = 1 - errorL2 / (h*w)
    print("SIMILARITY ", similarity)
    
    result = similarity>0.95

    if result is True:
        print("PASS\n")
        return 0
    else:
        print("FAIL\n")
        return 1


if __name__ == '__main__':
    print('Run the run_tests.py')