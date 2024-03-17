import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time
from dotenv import load_dotenv


load_dotenv()


class Loged_in_driver_instance:
    def __init__(self) -> None:
        self.base_url = "https://www.royalroad.com"
        self.home_page = "https://www.royalroad.com/account/login"
        self.email = os.getenv("RR_EMAIL")
        self.password = os.getenv("RR_PASSWORD")
        self.driver = webdriver.Chrome()
        self.wait = WebDriverWait(self.driver, 10)

    def log_in(self, email: str, password: str):
        self.driver.get(self.home_page)
        print(email)
        time.sleep(5)

        self.wait.until(presence_of_element_located((By.CSS_SELECTOR, "#email")))
        self.driver.find_element(By.CSS_SELECTOR, "#email").send_keys(email)
        self.driver.find_element(By.CSS_SELECTOR, "#password").send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "#password").send_keys(Keys.RETURN)
        time.sleep(5)

    def accept_privacy_promt(self):
        self.wait.until(
            presence_of_element_located(
                (By.XPATH, '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]')
            )
        )
        self.driver.find_element(
            By.XPATH, '//*[@id="ncmp__tool"]/div/div/div[3]/div[1]/button[2]'
        ).click()
        time.sleep(5)

    def get_logged_in_driver_instance(self):
        self.log_in(self.email, self.password)
        # self.accept_privacy_promt()
        return self.driver

    def dostuff(self):
        self.log_in(self.email, self.password)
        print(self.email)
        print(self.password)
