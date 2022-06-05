from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time

path_to_chromedriver = "/home/len/Work/RR_Bots/chromedriver"

home_page = "https://www.royalroad.com/account/login"
follow_page = "https://www.royalroad.com/my/follows"

email = "justlenard.justme@gmail.com"
password = "Close23282001"

# driver = webdriver.Chrome(path_to_chromedriver)
# wait = WebDriverWait(driver, 10)


# driver.get(home_page)


# wait.until(presence_of_element_located((By.CSS_SELECTOR, "#email")))
# driver.find_element(By.CSS_SELECTOR, "#email").send_keys(email)
# driver.find_element(By.CSS_SELECTOR, "#password").send_keys(password)
# driver.find_element(By.CSS_SELECTOR, "#password").send_keys(Keys.RETURN)
# driver.get(follow_page)
# driver.find_element_by_xpath(
#     '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]'
# ).click()

# # fiction-list-item row
# wait.until(presence_of_element_located((By.CSS_SELECTOR, ".fiction-list-item.row")))
# follow_list_container = driver.find_element(By.CSS_SELECTOR, "#result").get_attribute(
#     "outerHTML"
# )

# soup = BeautifulSoup(follow_list_container, "html.parser")
with open("page.html", "r") as file:
    soup = BeautifulSoup(file, "html.parser")

    all_ul = soup.select(".fiction-list-item.row > div > ul")

    # print(len(all_ul[1]))
    for x in all_ul[1]:
        print

    # for ul in all_ul:
    # if len(ul) == 2:

    # print(ul.li)
    # print(all_ul)
    # print(len(all_ul))
    # print(len(all_ul[1].select("li")))


time.sleep(55)
# driver.quit()
