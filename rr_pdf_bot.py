from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time
import string


# browser = webdriver.Chrome("/home/len/Work/RR_Bot/chromedriver")
# browser.get("http://google.com/ncr")
# time.sleep(100)
# comm_box = WebDriverWait(browser, 100)

with webdriver.Chrome("/home/len/Work/RR_Bot/chromedriver") as driver:

    wait = WebDriverWait(driver, 10)
    # driver.get(
    #     "https://www.royalroad.com/fiction/39336/valkyries-shadow/chapter/904348/empire-in-chains-act-6-chapter-13"
    # )

    # wait.until(presence_of_element_located((By.CSS_SELECTOR, ".chapter-inner")))
    # chapter_div = driver.find_element(By.CSS_SELECTOR, ".chapter-inner").get_attribute(
    #     "outerHTML"

    # )
    chapter_div = open("t.html")

    # print(chapter_div)

    soup = BeautifulSoup(chapter_div, "html.parser")

    all_p = soup.find_all("p")
    # print(len(soup.find_all("p")))
    # print(all_p[0].text)
    # pdf_file = open("pdf.pdf", "a")
    # pdf_file.write("hero")
    with open("pdf.pdf", "w") as pdf_file:
        for content in all_p:

            cleaned_text = (
                content.text.replace("\t", "")
                # .replace("\r", "")
                # .replace("\n", "")
            )

            print(len(cleaned_text))
            # if len(cleaned_text) > 100:
            #     cleaned_text[100] = "\n"
            pdf_file.write(cleaned_text + "\n")

    # driver.find_element_by_name("q").send_keys("cheese" + Keys.RETURN)
    # time.sleep(100)

    # for i, result in results.iteritems():
    #     print(f"#{i}: {result.text} ({result.get_property('href')})")
