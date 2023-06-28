from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from splinter import Browser
from time import sleep
from os.path import exists
import urllib


def browse_all(art_list, param_list, img_names):
    browser = init_browser()
    browser.driver.maximize_window()
    for art, param, img_name in zip(art_list, param_list, img_names):
        browse(art, param, img_name, browser)
    browser.quit()


def init_browser():
    """initialize chrome browser using chromedriver"""
    #object of ChromeOptions class
    op = webdriver.ChromeOptions()
    #change download directory
    p = {'download.default_directory': r'C:\Users\lewi0\Desktop\lewi0622.github.io\Tests\imgs'}

    #add options to browser
    op.add_experimental_option('prefs', p)

    # tell dev tools and usb errors to stfu
    op.add_experimental_option('excludeSwitches', ['enable-logging'])

    executable_path = {"executable_path": "c:/bin/chromedriver/chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False, options=op)


def browse(art, params, img_name, browser):
    url_base = r'https://lewi0622.github.io/projects/' + art + r'/index.html'

    url = url_base + '?' + urllib.parse.urlencode(params)
    print("Navigating to :", url)

    # this will open up a new headless browser to url
    browser.visit(url)
    
    # wait for load and save
    sleep(2)
    save_button = browser.find_by_id("Save")
    save_button.click()
    while not exists(img_name.replace(".png", " (1).png")):
        sleep(0.5)


if __name__ == '__main__':
    print('Run the run_tests.py')