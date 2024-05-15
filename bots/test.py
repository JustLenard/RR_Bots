import json


only_new_links = [
    "www.royalroad.com/fiction/67742/elydes-book-1-stubs-on-june-11/chapter/1636066/chapter-227-preparations",
    "www.royalroad.com/fiction/67742/elydes-book-1-this-is/chapter/1636066/stuff",
]


json_file = "../db/novels_info1.json"


for link in only_new_links:
    print("Checking out ", link)
    with open(json_file, "r+") as file:
        file_data = json.load(file)

        file.seek(0)

        for new_link in only_new_links:
            fiction_name = link.split("/")[5]
            print("\033[93m\033[1m >>This is  fiction_name \033[0m", fiction_name)
            file_data[fiction_name] = new_link

        file_data["tes"] = "Works"

        json.dump(file_data, file)
        file.truncate()


print("Finished succefully")
