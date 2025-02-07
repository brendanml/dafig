from requests_oauthlib import OAuth1
import requests
import json
import sys
from dotenv import load_dotenv
import os
import httpx
import asyncio

def fetchData(url, auth):
    response = requests.get(url, auth=auth)
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=4))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def main():
    load_dotenv("../backend/.env")
    CONS_KEY = os.getenv("CON_KEY")
    CONS_SEC = os.getenv("CON_SEC")
    if sys.argv[1] == "-h":
        ACCESS_TOKEN = os.getenv("ACC_TOK")
        ACCESS_SECRET = os.getenv("ACC_SEC")
    elif sys.argv[1] == "-p":
        ACCESS_TOKEN = os.getenv("PAR_TOK")
        ACCESS_SECRET = os.getenv("PAR_SEC")


    with open("../backend/swFigs.json", "r") as f:
        figs = json.load(f)
        fig_id_list = [fig["ITEMID"] for fig in figs]

    print(fig_id_list)


    # OAuth1 session
    auth = OAuth1(CONS_KEY, CONS_SEC, ACCESS_TOKEN, ACCESS_SECRET)

    # # API URL
    url = "https://api.bricklink.com/api/store/v1"


    # # Make the API request
    fetchData(f"{url}/items/minifig/{fig_id_list[0]}/price?guide_type=stock&new_or_used=N", auth),
    # for fig_id in fig_id_list:
    #     fetchData(f"{url}/items/minifig/{fig_id}/price?guide_type=stock&new_or_used=N", auth),
    #     fetchData(f"{url}/items/minifig/{fig_id}/price?guide_type=stock&new_or_used=U", auth),
    #     fetchData(f"{url}/items/minifig/{fig_id}/price?guide_type=sold&new_or_used=N", auth),
    #     fetchData(f"{url}/items/minifig/{fig_id}/price?guide_type=sold&new_or_used=U", auth),
    #     fetchData(f"{url}/items/minifig/{fig_id}", auth)



    # # response = requests.get(f"{url}/items/minifig/{fig_id_list[0]}", auth=auth)

    # # Check if the request was successful
    # if response.status_code == 200:
    #     # Parse JSON data
    #     data = response.json()

    #     # Print the JSON response
    #     print(json.dumps(data, indent=4))

    #     # Example: Access specific fields
    #     # for item in data.get("data", []):  # Adjust based on the API's actual structure
    #     #     item_name = item.get("item", {}).get("name", "N/A")
    #     #     color_name = item.get("color_name", "N/A")
    #     #     print(f"Item Name: {item_name}, Colour: {color_name}")
    # else:
    #     print(f"Error: {response.status_code}")
    #     print(response.text)



# get price guide for item, check if its in specifi
# 
# ed countries

if __name__ == "__main__":
    main()

# design potential uses/ui?