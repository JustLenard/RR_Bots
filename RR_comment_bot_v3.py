import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time

path_to_chromedriver = "/home/len/work/RR_Bots/chromedriver"

home_page = "https://www.royalroad.com/account/login"
follow_page = "https://www.royalroad.com/my/follows"
base_url = "https://www.royalroad.com"
my_comment = "Thank you for the chapter!"
my_user_name = "Lenard"
links_file_name = "chapter_links.txt"

email = ""
password = ""

time.sleep(5)

driver = webdriver.Chrome(path_to_chromedriver)
wait = WebDriverWait(driver, 10)


def log_in(email, password):
    driver.get(home_page)
    wait.until(presence_of_element_located((By.CSS_SELECTOR, "#email")))
    driver.find_element(By.CSS_SELECTOR, "#email").send_keys(email)
    driver.find_element(By.CSS_SELECTOR, "#password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "#password").send_keys(Keys.RETURN)
    driver.get(follow_page)


def accept_privacy_promt():
    wait.until(
        presence_of_element_located(
            (By.XPATH, '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]')
        )
    )
    driver.find_element(
        By.XPATH, '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]'
    ).click()


log_in(email, password)
accept_privacy_promt()


def get_chapter_links():
    chapter_links = []
    wait.until(presence_of_element_located((By.CSS_SELECTOR, ".fiction-list-item.row")))
    follow_list_container = driver.find_element(
        By.CSS_SELECTOR, "#result"
    ).get_attribute("outerHTML")

    soup = BeautifulSoup(follow_list_container, "html.parser")

    uls_of_fictions = soup.select(".fiction-list-item.row > div > ul")

    for ul in uls_of_fictions:
        a_tags = ul.find_all("a")
        if len(a_tags) == 2:
            chapter_links.append(base_url + a_tags[1]["href"])
        else:
            chapter_links.append(base_url + a_tags[0]["href"])

    print(chapter_links)
    return chapter_links


links_to_chapters = get_chapter_links()
# print("chapter_links", links_to_chapters)


def file_with_links_does_not_exist(file_name):
    return os.path.isfile(file_name) == False


def create_file_with_links(file_name):
    file = open(file_name, "w")
    file.close()


if file_with_links_does_not_exist(links_file_name):
    create_file_with_links(links_file_name)


def filter_out_the_old_links(links_array):
    new_links = []
    links_from_file = []

    with open(links_file_name, "r+") as f:
        links_from_file = f.readlines()
        links_from_file = [x.replace("\n", "") for x in links_from_file]

        for link in links_array:

            if link not in links_from_file:
                new_links.append(link)
                f.write(str(link) + "\n")

        if len(links_from_file) > 500:
            os.remove(links_file_name)
        print(len(links_from_file))
    return new_links, links_from_file


only_new_links, links_from_file = filter_out_the_old_links(links_to_chapters)
print("Those are the new chapater links ", only_new_links)


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
            # if comment_container.find("p", string=my_comment) != None:
            #     return True

    return False


def last_page_button_exists():
    try:
        nav = driver.find_element(
            By.CSS_SELECTOR, ".text-center.chapter-nav"
        ).get_attribute("outerHTML")
        nav_soup = BeautifulSoup(nav, "html.parser")
        button = nav_soup.find("a", string="Last »")
        return button != None
    except:
        return False


def i_can_comment():
    try:
        driver.switch_to.frame("comment_ifr")
        time.sleep(3)
        driver.find_element(By.ID, "tinymce").find_element(By.TAG_NAME, "p")
        driver.switch_to.parent_frame()
        return True
    except:
        print("I am blocked from commenting")
        return False


# Maybe another day
# def get_authors_name():
#     elem = driver.find_element(By.CSS_SELECTOR, ".font-blue-dark").get_attribute(
#         "outerHTML"
#     )
#     soup = BeautifulSoup(elem, "html.parser")
#     print("soup", soup)
#     print(soup.string)
#     print(soup.a.string)


def should_leave_comment(link, comment_page_number):
    driver.get(link + "?comments=" + str(comment_page_number))
    wait_for_page_to_load()
    load_comment_section()

    time.sleep(1)
    comments_html_container = driver.find_element(
        By.CSS_SELECTOR, ".portlet-body.comments.comment-container"
    ).get_attribute("outerHTML")

    comments_soup = BeautifulSoup(comments_html_container, "html.parser")

    if my_comment_exists(comments_soup):
        print("Already left comment here")
        return False
    elif last_page_button_exists():
        print("Checking comment page number", comment_page_number)
        return should_leave_comment(link, comment_page_number + 1)
    else:
        return True


def leave_comment():
    driver.switch_to.frame("comment_ifr")
    time.sleep(3)

    driver.find_element(By.ID, "tinymce").find_element(By.TAG_NAME, "p").send_keys(
        my_comment
    )
    driver.switch_to.parent_frame()

    driver.find_element(By.XPATH, "//button[@class='btn btn-primary btn-sm']").click()
    print("Commented on the chapter")
    time.sleep(3)


def is_not_first_chapter():
    time.sleep(1)
    button_elem = driver.find_element(
        By.CSS_SELECTOR, ".btn.btn-primary.col-xs-12"
    ).get_attribute("disabled")
    return button_elem != True


def load_previous_chapter():
    driver.find_element(By.CSS_SELECTOR, ".btn.btn-primary.col-xs-12").click()


def comment_on_previous_chapters(current_url):

    if current_url in links_from_file:
        print("The link is in the file. Aborting.")
        return

    driver.get(current_url)
    wait_for_page_to_load()
    print("should_leave_comment", should_leave_comment(current_url, 1))

    if should_leave_comment(current_url, 1):
        leave_comment()
        wait_for_page_to_load()
        time.sleep(2)
        if is_not_first_chapter():
            load_previous_chapter()
            wait_for_page_to_load()

            current_url = driver.current_url
            print(current_url)
            comment_on_previous_chapters(current_url)


for link in only_new_links:
    print("Checking out ", link)
    driver.get(link)
    wait_for_page_to_load()

    if i_can_comment():
        if should_leave_comment(link, 1):
            leave_comment()
            wait_for_page_to_load()
            if is_not_first_chapter():
                load_previous_chapter()
                wait_for_page_to_load()

                current_url = driver.current_url
                comment_on_previous_chapters(current_url)

        time.sleep(2)

print("Finished succefully")
