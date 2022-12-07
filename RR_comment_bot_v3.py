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
base_url = 'https://www.royalroad.com'
my_comment = "Your neighboring AI overlord sends his warm regards and thanks the author for the chapter."


email = ""
password = ""

driver = webdriver.Chrome(path_to_chromedriver)
wait = WebDriverWait(driver, 10)

chapter_links = []


# driver.get(home_page)
# wait.until(presence_of_element_located((By.CSS_SELECTOR, "#email")))
# driver.find_element(By.CSS_SELECTOR, "#email").send_keys(email)
# driver.find_element(By.CSS_SELECTOR, "#password").send_keys(password)
# driver.find_element(By.CSS_SELECTOR, "#password").send_keys(Keys.RETURN)
# driver.get(follow_page)

def accept_privacy_promt():
    driver.find_element_by_xpath(
    '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]'
    ).click()
    
# # fiction-list-item row
# wait.until(presence_of_element_located((By.CSS_SELECTOR, ".fiction-list-item.row")))
# follow_list_container = driver.find_element(By.CSS_SELECTOR, "#result").get_attribute(
#     "outerHTML"
# )

# with open("page.html", "r") as file:
# soup = BeautifulSoup(follow_list_container, "html.parser")
# soup = BeautifulSoup(file, "html.parser")

# uls_of_fictions = soup.select(".fiction-list-item.row > div > ul")

# for ul in uls_of_fictions:
#     a_tags = ul.find_all('a')
#     if len(a_tags) == 2:
#         chapter_links.append(base_url + a_tags[1]['href'])
#     else:
#         chapter_links.append(base_url + a_tags[0]['href'])


#     print(chapter_links)

chapter_links = ['https://www.royalroad.com/fiction/16946/azarinth-healer/chapter/1057234/chapter-907-fissure', 'https://www.royalroad.com/fiction/32027/earths-eulogy/chapter/1043056/chapter-7-april-93-ad-red-river--a-different-situation', 'https://www.royalroad.com/fiction/20568/tree-of-aeons-an-isekai-story/chapter/1057303/cloven-hoofs', 'https://www.royalroad.com/fiction/39336/valkyries-shadow/chapter/1057150/the-tiger-and-the-dragon-act-8-chapter-10', 'https://www.royalroad.com/fiction/39408/beware-of-chicken/chapter/1054679/interlude-fortuitous-encounter', 'https://www.royalroad.com/fiction/21188/forge-of-destiny/chapter/649038/threads-62-dressmaker-2', 'https://www.royalroad.com/fiction/45384/a-sinners-eden/chapter/741841/ch-19-evo', 'https://www.royalroad.com/fiction/42367/12-miles-below/chapter/744074/book-2-prologue', 'https://www.royalroad.com/fiction/48211/deathworld-commando-reborn/chapter/1050917/vol6-ch132--i-am-who-i-am', 'https://www.royalroad.com/fiction/26675/a-journey-of-black-and-red/chapter/1054319/182-the-first-trial', 'https://www.royalroad.com/fiction/40182/only-villains-do-that/chapter/818541/231-in-which-the-dark-lord-battens-down-the-hatches', 'https://www.royalroad.com/fiction/23173/the-simulacrum/chapter/1050311/volume-4-extra-7-there-is-no-escaping-the-ships', 'https://www.royalroad.com/fiction/37155/knight-and-smith/chapter/1045363/book-two-chapter-fifty-eight', 'https://www.royalroad.com/fiction/41330/virtuous-sons-a-greco-roman-xianxia/chapter/1029394/1121', 'https://www.royalroad.com/fiction/36065/sylver-seeker/chapter/746919/ch106-no-place-like', 'https://www.royalroad.com/fiction/21410/super-minion/chapter/593299/ch50-spilt-milk', 'https://www.royalroad.com/fiction/18186/the-scourged-earth/chapter/418528/614-drama-and-queens']




def load_comments():
    # comment_input = wait.until(
    #     presence_of_element_located((By.CSS_SELECTOR, ".tox-edit-area"))
    # )
    comment_input = wait.until(
        presence_of_element_located((By.CSS_SELECTOR, ".btn.btn-primary.margin-top-10"))
    )
    
    driver.execute_script("arguments[0].scrollIntoView(true);", comment_input)

def check_if_my_comment_exists(comments_html_container):
    comments_soup = BeautifulSoup(comments_html_container, "html.parser")
    all_p_tags =  comments_soup.find_all('p')
    
    for p in all_p_tags:
        if p.string == my_comment:
            return True
    return False
    

for link in chapter_links:
    driver.get(link)
    wait.until(presence_of_element_located((By.CSS_SELECTOR, ".chapter-inner.chapter-content")))
    load_comments()
    time.sleep(2)
    comments_html_container = driver.find_element(By.CSS_SELECTOR, ".portlet-body.comments.comment-container").get_attribute(
    "outerHTML")
    response = check_if_my_comment_exists(comments_html_container)
    print(response)

    if response == False:
        nav = driver.find_element(By.CSS_SELECTOR, ".text-center.chapter-nav").get_attribute('outerHTML')
        nav_soup = BeautifulSoup(nav, 'html.parser')

        comments_pagination = ()


    
    # print(all_p_tags)

    # print(comments_html_container)
    time.sleep(2)




    # print(len(all_ul))
    # for x in all_ul[1]:
    #     print




    # for ul in all_ul:
    # if len(ul) == 2:

    # print(ul.li)
    # print(all_ul)
    # print(len(all_ul))
    # print(len(all_ul[1].select("li")))


time.sleep(55)
# driver.quit()


# comments_pagination = [1,2,3,3]
# print(comments_pagination)
# comments_pagination = list(set(comments_pagination))
# comments_pagination.pop(0)

# print(comments_pagination)
