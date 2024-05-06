import json
from textwrap import indent


name = "Timmy"


link = "https://www.royalroad.com/fiction/16946/azarinth-healer/chapter/1065312/chapter-921-peak"


fiction_name = link.split("/")[5]


my_obj = {fiction_name: link, "dude": "mate"}


with open("data_file.json", "w") as write_file:
    json.dump(my_obj, write_file)


with open("data_file.json", "r") as read_file:
    decoded_json = json.load(read_file)

    print(decoded_json["dude"])
    print("\033[93m\033[1m >>This is  keys \033[0m", decoded_json.keys())
    print(
        "\033[93m\033[1m >>This is  values \033[0m",
    )
    my_set = set(decoded_json.values())
    print("mate" in my_set)


arr = [
    "https://www.royalroad.com/fiction/47995/memoirs-of-your-local-small-time-villainess/chapter/1033485/chapter-89-practice-practice-practice",
    "https://www.royalroad.com/fiction/43318/the-butcher-of-gadobhra/chapter/1616191/chapter-390-riding-the-white-lightning",
    "https://www.royalroad.com/fiction/73052/technomagica-progression-fantasy-litrpg/chapter/1410214/62-dead-guardians",
    "https://www.royalroad.com/fiction/81642/cultivation-nerd-xianxia/chapter/1623550/chapter-78-a-war-of-meaning",
    "https://www.royalroad.com/fiction/53765/hope/chapter/1623549/327-there-must-have-bean-a-better-pun-somewhere",
    "https://www.royalroad.com/fiction/67742/elydes/chapter/1621864/chapter-221-three-ways-to-take-down-an-evil-lizard",
    "https://www.royalroad.com/fiction/71567/void-runner-sci-fi-survival-adventure/chapter/1395420/chapter-twenty-twilight-war",
    "https://www.royalroad.com/fiction/45331/horizon-of-war/chapter/1592110/chapter-124-the-secret-within",
    "https://www.royalroad.com/fiction/80417/second-summons-book-1-stubs-in-3-weeks/chapter/1541425/b2-chapter-2-hard-decisions-part-2",
    "https://www.royalroad.com/fiction/23173/the-simulacrum/chapter/1292086/chapter-115",
    "https://www.royalroad.com/fiction/65629/the-game-at-carousel-a-horror-movie-litrpg/chapter/1619840/interlude--ramona-part-three",
    "https://www.royalroad.com/fiction/39336/valkyries-shadow/chapter/1297932/the-paladin-of-the-holy-kingdom-part-iii-act-3",
    "https://www.royalroad.com/fiction/36065/sylver-seeker/chapter/1535742/ch249-back-again",
    "https://www.royalroad.com/fiction/20568/tree-of-aeons-an-isekai-story/chapter/1607991/290-greenfields-vii",
    "https://www.royalroad.com/fiction/41330/virtuous-sons-a-greco-roman-xianxia/chapter/1573390/29",
    "https://www.royalroad.com/fiction/49879/paranoid-mage/chapter/1098817/chapter-13-trap",
    "https://www.royalroad.com/fiction/39408/beware-of-chicken/chapter/1092921/v3c572-friends-of-the-family-part-2",
    "https://www.royalroad.com/fiction/66068/the-reluctant-magi/chapter/1419298/the-reluctant-magi-book-2-chapter-29",
    "https://www.royalroad.com/fiction/21410/super-minion/chapter/1463481/story-ripped-to-amazon",
    "https://www.royalroad.com/fiction/37155/knight-and-smith/chapter/1045363/book-two-chapter-fifty-eight",
]


file_path = "./db/novels_info.json"


# with open(file_path, "w") as file:
#     my_dict = {}

#     for link in arr:
#         fiction_name = link.split("/")[5]
#         my_dict[fiction_name] = link

#     json.dump(my_dict, file, indent=2)


# with open(file_path, "r+") as file:
#     data = json.load(file)

#     file.seek(0)

#     data["super-minion"] = "mate"

#     json.dump(data, file)
#     file.truncate()

my_set = set(arr)
