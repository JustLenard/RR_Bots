import os

file_name = "chapter_links.txt"


def file_with_links_exists(file_name):
    return os.path.isfile(file_name) == False


def create_file_with_links(file_name):
    file = open(file_name, "w")
    file.close()


if file_with_links_exists(file_name):
    create_file_with_links(file_name)


links_array = ["fuck", "something ", "else", "another", "original", "1"]


def filter_out_the_old_links(links_array):
    new_links = []
    links_from_file = []

    with open(file_name, "r+") as f:
        links_from_file = f.readlines()
        links_from_file = [x.replace("\n", "") for x in links_from_file]

        for link in links_array:

            if link not in links_from_file:
                new_links.append(link)
                f.write(str(link) + "\n")

        if len(links_from_file) > 500:
            os.remove(file_name)
        print(len(links_from_file))
    return new_links, links_from_file


new_links, links_from_file = filter_out_the_old_links(links_array)
print("new_links", new_links)
print("links_from_file", links_from_file)
