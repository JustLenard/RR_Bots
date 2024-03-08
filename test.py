from dotenv import load_dotenv
from selenium import webdriver
import os
import file

load_dotenv()

print(os.getenv("RR_EMAIL"))


print(file.x)
print(file.do_stuff("mate"))

with open("chapter_links.txt", "r+") as f:
    links_from_file = f.readlines()
    links_from_file = [x.replace("\n", "") for x in links_from_file]

    for link in links_array:

        if link not in links_from_file:
            new_links.append(link)
            f.write(str(link) + "\n")

    if len(links_from_file) > 500:
        os.remove(links_file_name)
    print(len(links_from_file))
