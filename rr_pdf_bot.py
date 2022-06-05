from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time

fiction_link = "https://www.royalroad.com/fiction/36065/sylver-seeker/chapter/746919/ch106-no-place-like"
path_to_chromedriver = "/home/len/Work/RR_Bots/chromedriver"
file_name = fiction_link.split("/")[5]

driver = webdriver.Chrome(path_to_chromedriver)
wait = WebDriverWait(driver, 10)


def get_chapters_content(link, driver):

    driver.get(link)

    wait.until(presence_of_element_located((By.CSS_SELECTOR, ".chapter-inner")))
    chapter_div = driver.find_element(By.CSS_SELECTOR, ".chapter-inner").get_attribute(
        "outerHTML"
    )

    soup = BeautifulSoup(chapter_div, "html.parser")

    all_p_tags = soup.find_all("p")

    with open(file_name, "a") as file:
        for content in all_p_tags:

            cleaned_text = (
                content.text.replace("\t", "")
                # .replace("\r", "")
                # .replace("\n", "")
            )

            file.write(cleaned_text + "\n\n")

    wait.until(
        presence_of_element_located((By.CSS_SELECTOR, ".btn.btn-primary.col-xs-12"))
    )

    next_chapter_link = driver.find_elements(
        By.CSS_SELECTOR, ".btn.btn-primary.col-xs-12"
    )[1].get_attribute("href")

    if next_chapter_link != None:

        time.sleep(2)
        get_chapters_content(next_chapter_link, driver)


get_chapters_content(fiction_link, driver)

driver.close()
