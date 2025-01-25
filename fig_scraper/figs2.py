from requests_oauthlib import OAuth1
import requests
import json
import xml.etree.ElementTree as ET
import sys
from dotenv import load_dotenv
import os

def main():
    load_dotenv()
    CONS_KEY = os.getenv("CONS_KEY")
    CONS_SEC = os.getenv("CONS_SEC")
    if sys.argv[1] == "-h":
        ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
        ACCESS_SECRET = os.getenv("ACCESS_SECRET")
    elif sys.argv[1] == "-p":
        ACCESS_TOKEN = os.getenv("PARENT_TOKEN")
        ACCESS_SECRET = os.getenv("PARENT_SECRET")


    input_file = "./starwarsMinifigures.xml"
    tree = ET.parse(input_file)


    root = tree.getroot()

    fig_id_list = []
    # Iterate over each ITEM
    for item in root.findall('ITEM'):
        print(item.find('ITEMID').text)
        item_id = item.find('ITEMID').text
        fig_id_list.append(item_id)

    # Constants for OAuth1

    # OAuth1 session
    auth = OAuth1(CONS_KEY, CONS_SEC, ACCESS_TOKEN, ACCESS_SECRET)

    # API URL
    url = "https://api.bricklink.com/api/store/v1"

    # Define the fields for data extraction
    fields = [
        {"label": "Item Name", "value": "item.name"},
        {"label": "Colour", "value": "color_name"}
    ]

    # Make the API request


    response = requests.get(f"{url}/items/minifig/{fig_id_list[0]}/price?country_code=CA&new_or_used=U", auth=auth)
    # response = requests.get(f"{url}/items/minifig/{fig_id_list[0]}", auth=auth)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse JSON data
        data = response.json()

        # Print the JSON response
        print(json.dumps(data, indent=4))

        # Example: Access specific fields
        # for item in data.get("data", []):  # Adjust based on the API's actual structure
        #     item_name = item.get("item", {}).get("name", "N/A")
        #     color_name = item.get("color_name", "N/A")
        #     print(f"Item Name: {item_name}, Colour: {color_name}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)



# get price guide for item, check if its in specifi
# 
# ed countries

if __name__ == "__main__":
    main()

# design potential uses/ui?