import json
from pprint import pp
import os
from typing import Dict, Set
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time
from login import Loged_in_driver_instance
from selenium import webdriver


follow_page = "https://www.royalroad.com/my/follows"
base_url = "https://www.royalroad.com"
my_comment = "Thank you for the chapter!"
my_user_name = "Lenard"
links_file_name = "../db/novels_info.txt"
json_file = "../db/novels_info.json"


driver = Loged_in_driver_instance().get_logged_in_driver_instance()
# driver = webdriver.Chrome()

wait = WebDriverWait(driver, 10)


fiction_names: Set[str] = set()
last_commented_chapters: Set[str] = set()

with open(json_file) as file:
    data: Dict[str, str] = json.load(file)
    fiction_names = set(data.keys())
    last_commented_chapters = set(data.values())

pp(fiction_names)
pp(last_commented_chapters)


def get_chapter_links() -> list[str]:
    chapter_links = []
    driver.get(follow_page)
    wait.until(presence_of_element_located((By.CSS_SELECTOR, ".fiction-list-item.row")))
    follow_list_container = driver.find_element(
        By.CSS_SELECTOR, "#result"
    ).get_attribute("outerHTML")

    soup = BeautifulSoup(follow_list_container, "html.parser")

    uls_of_fictions = soup.select(".fiction-list-item.row > div > ul")

    for ul in uls_of_fictions:
        a_tags = ul.find_all("a")
        link = ""
        if len(a_tags) == 2:
            link = base_url + a_tags[1]["href"]
        else:
            link = base_url + a_tags[0]["href"]

        if link not in last_commented_chapters:
            chapter_links.append(link)

    return chapter_links


only_new_links = get_chapter_links()

print("\033[93m\033[1m >>This is  only_new_links \033[0m", only_new_links)


def wait_for_page_to_load():
    wait.until(
        presence_of_element_located((By.CSS_SELECTOR, ".chapter-inner.chapter-content"))
    )


def load_comment_section():
    wait_for_page_to_load()
    comment_input = wait.until(
        presence_of_element_located((By.CSS_SELECTOR, ".col-md-8.profile-info"))
    )

    driver.execute_script("arguments[0].scrollIntoView(true);", comment_input)


def my_comment_exists(comments_soup):
    all_comment_divs = comments_soup.find_all("div", class_="comment")
    for comment_container in all_comment_divs:
        my_profile_link = comment_container.find("a", string=my_user_name)
        if my_profile_link != None:
            return True
    return False


def is_not_last_comment_page():
    try:
        nav = driver.find_element(
            By.CSS_SELECTOR, ".text-center.chapter-nav"
        ).get_attribute("outerHTML")
        nav_soup = BeautifulSoup(nav, "html.parser")
        button = nav_soup.find("a", string="Last »")
        return button != None
    except:
        return False


def can_comment():
    try:
        driver.switch_to.frame("comment_ifr")
        time.sleep(1)
        driver.find_element(By.ID, "tinymce").find_element(By.TAG_NAME, "p")
        driver.switch_to.parent_frame()
        return True
    except:
        print("I am blocked from commenting")
        return False


def should_leave_comment(link: str, comment_page_number: int) -> bool:
    # We are already on the firt page. No need to load it again.
    if comment_page_number != 1:
        driver.get(f"{link}?comments={str(comment_page_number)}")

    wait_for_page_to_load()

    if can_comment() == False:
        return False

    load_comment_section()

    time.sleep(1)
    comments_html_container = driver.find_element(
        By.CSS_SELECTOR, ".portlet-body.comments.comment-container"
    ).get_attribute("outerHTML")

    comments_soup = BeautifulSoup(comments_html_container, "html.parser")

    print("Checking comment page number", comment_page_number)

    if my_comment_exists(comments_soup):
        print("Already left comment here")
        return False
    elif is_not_last_comment_page():
        return should_leave_comment(link, comment_page_number + 1)
    else:
        return True


def leave_comment():
    driver.switch_to.frame("comment_ifr")
    time.sleep(2)

    driver.find_element(By.ID, "tinymce").find_element(By.TAG_NAME, "p").send_keys(
        my_comment
    )
    driver.switch_to.parent_frame()

    driver.find_element(By.XPATH, "//button[@class='btn btn-primary btn-sm']").click()
    print("Commented on the chapter")
    time.sleep(2)


def is_not_first_chapter():
    time.sleep(1)
    button_elem = driver.find_element(
        By.CSS_SELECTOR, ".btn.btn-primary.col-xs-12"
    ).get_attribute("disabled")
    return button_elem != True


def load_previous_chapter():
    driver.find_element(By.CSS_SELECTOR, ".btn.btn-primary.col-xs-12").click()


def run_bot(current_url):

    if current_url in last_commented_chapters:
        print("The link is in the file. Aborting.")
        return

    driver.get(current_url)
    wait_for_page_to_load()

    if should_leave_comment(current_url, 1):
        leave_comment()
        wait_for_page_to_load()
        time.sleep(1)

        if is_not_first_chapter():
            load_previous_chapter()
            wait_for_page_to_load()

            current_url = driver.current_url
            print(current_url)
            run_bot(current_url)


for link in only_new_links:
    print("Checking out ", link)
    run_bot(link)


with open(json_file, "r+") as file:
    data = json.load(file)

    file.seek(0)

    for new_link in only_new_links:
        fiction_name = link.split("/")[5]
        data[fiction_name] = link

    data["tes"] = "Works"

    json.dump(data, file)
    file.truncate()


print("Finished succefully")
