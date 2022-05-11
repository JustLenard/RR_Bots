from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.by import By


email = ""
my_password = ""
follow_page = "https://www.royalroad.com/my/follows"
message = "Your neighboring AI overlord sends his warm regards and thanks the author for the chapter."


browser = webdriver.Chrome("/home/len/PycharmProjects/chromedriver")
browser.get(follow_page)
browser.find_element_by_id("email").send_keys(email)
browser.find_element_by_id("password").send_keys(my_password)
browser.find_element_by_id("password").send_keys(Keys.RETURN)
browser.get(follow_page)
browser.find_element_by_xpath(
    '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]'
).click()


links_list = []
soup = BeautifulSoup(browser.page_source, "html.parser")
container = soup.find_all("ul", "list-unstyled margin-bottom-15")
for box in container:
    try:
        link = box.find("li").find_next_sibling().a["href"]
    except:
        link = box.find("a")["href"]
    links_list.append("https://www.royalroad.com" + link)
print(links_list)


cleaned_fl = []
with open("EditedList.txt", "r+") as f:
    for i in links_list:
        if i not in f.readlines():
            print(i)
            print("the read line thing" + str(f.readlines()))
            cleaned_fl.append(i)
            f.write(str(i) + "\n")
print(cleaned_fl)


def load_comments():
    comm_box = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//a[@class='font-blue-dark']"))
    )
    browser.execute_script("arguments[0].scrollIntoView(true);", comm_box)


def check_marked():
    time.sleep(1)
    try:
        my_comment = browser.find_element_by_xpath(
            "//*[contains(text (), 'Your neighboring AI overlord sends his warm regards and thanks the author for the chapter.')]"
        )
    except:
        my_comment = []
    try:
        no_comment = browser.find_elements_by_xpath(
            "//div[@class='portlet-body comments comment-container ']/h4[contains(text (), 'No one has commented yet. Be the first!')]"
        )
    except:
        no_comment = []
    if my_comment != []:
        return False
    if no_comment != []:
        return True
    if my_comment == [] and no_comment == []:
        return "Scroll"


for link in cleaned_fl:
    print(f"Checking out: {link}:")
    print("Looking through comment page nr: 1")
    n = 1
    browser.get(link)
    load_comments()
    need_comment = check_marked()
    current_url = browser.current_url
    while True:
        if "chapter" not in str(current_url):
            break
        while need_comment == "Scroll":
            n += 1
            browser.get(current_url + "?comments=" + str(n))
            print(f"Looking through comment page nr: {n}")
            load_comments()
            need_comment = check_marked()
        if need_comment == False:
            print("Spot is already marked\n")
            break
        if need_comment == True:
            n = 1
            load_comments()
            print("Marking the spot\n")
            browser.switch_to.frame("comment_ifr")
            browser.find_element_by_xpath("//body[@id='tinymce']/p").send_keys(message)
            browser.switch_to.parent_frame()
            browser.find_element_by_xpath(
                "//button[@class='btn btn-primary btn-sm']"
            ).click()
            time.sleep(1)
            button = (
                WebDriverWait(browser, 10)
                .until(
                    EC.presence_of_element_located(
                        (
                            By.XPATH,
                            "//div[@class='row margin-bottom-10 margin-left-0 margin-right-0']/a[1]",
                        )
                    )
                )
                .click()
            )
            time.sleep(1)
            print("Looking through previous chapters")
            print(browser.current_url)
            current_url = browser.current_url
            load_comments()
            need_comment = check_marked()


browser.quit()

# the adding to the list
