from dotenv import load_dotenv
from selenium import webdriver

# from 'bots/login' import Loged_in_driver_instance
from bots.login import Loged_in_driver_instance
import os

load_dotenv()

# print(os.getenv("RR_EMAIL"))
# print(os.getenv("RR_PASSWORD"))

# with open("mate.txt", "w+") as f:
#     f.write("mate")


# class MyClass:
#     def __init__(self, name: str) -> None:
#         self.mate = name

#     def get_stuff(self):
#         return self.mate


# dude = MyClass("timmy").get_stuff()
# print(dude)

# with open("chapter_links.txt", "r+") as f:
#     links_from_file = f.readlines()
#     links_from_file = [x.replace("\n", "") for x in links_from_file]

#     for link in links_array:

#         if link not in links_from_file:
#             new_links.append(link)
#             f.write(str(link) + "\n")

#     if len(links_from_file) > 500:
#         os.remove(links_file_name)
#     print(len(links_from_file))


mate = Loged_in_driver_instance().dostuff()
