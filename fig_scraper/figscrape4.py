import re
import json
import urllib.parse
from requests_html import AsyncHTMLSession
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import time
import random
import math
import asyncio

import json
from bs4 import BeautifulSoup
import os
from requests_html import AsyncHTMLSession
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
from pathlib import Path
import urllib.parse
import re
with open("swFigs.json", "r") as fig_file:
    fig_data = json.load(fig_file)


# print(fig_data[0])

ua = UserAgent()

async def fetch_and_render(session, url, headers, retries=3, timeout=30):
    """Fetch and render a page using an existing session, with optional retries."""
    await asyncio.sleep(random.uniform(1, 3))
    for attempt in range(1, retries + 1):
        try:
            res = await session.get(url, headers=headers)
            await res.html.arender(timeout=timeout)  # Increase timeout if needed
            return res.html
        except Exception as e:
            print(f"Attempt {attempt}/{retries} failed for {url}: {e}")
            if attempt < retries:
                await asyncio.sleep(2)  # wait briefly before retry
    return None  # Return None if all retries fail


def soupify(html):
    soup = BeautifulSoup(html.html, "html.parser")

    # Grab figure info
    figure_name = soup.find("h1", id="item-name-title")
    if not figure_name:
        print("No figure name found!")
        return None, {}, {}

    figure_name = figure_name.get_text(strip=True)

    figure_id_tag = soup.find("span", style="font-weight: bold; color: #2C6EA5")
    if not figure_id_tag:
        print("No figure ID found!")
        return None, {}, {}

    figure_id = figure_id_tag.get_text(strip=True)

    fig_image = soup.find("img", class_="pciImageMain")
    fig_image_url = fig_image["src"].split("//")[1] if fig_image and "src" in fig_image.attrs else None

    if not fig_image_url:
        print("No image URL found!")
        return None, {}, {}

    # Grab listings
    items = soup.find_all("tr", class_="pciItemContents")
    listings = {}
    stores = {}

    store_in_url_pattern = r'(?<=\.com/)[^?]+'

    for item in items:
        anchor = item.find("a", class_="pciItemNameLink")
        if not anchor or not anchor.has_attr("href"):
            print("Skipping: No anchor or missing href")
            continue  # Skip this item

        href_val = anchor["href"]
        parts = href_val.split("//")
        if len(parts) < 2 or "itemID=" not in parts[1]:
            print(f"Skipping malformed URL: {href_val}")
            continue

        url_part = parts[1]

        store_name_tag = item.find("span", class_="pspStoreName")
        store_name = store_name_tag.get_text(strip=True) if store_name_tag else "Unknown Store"

        store_link = url_part.split("?")[0]
        listing_link = url_part
        listing_id = url_part.split("itemID=")[1]

        price_cell = item.find("td", style="text-align: right;")
        price = price_cell.get_text(strip=True).split("(")[0].strip() if price_cell else "Unknown Price"

        country_cell = item.find("span", style="font-size: 11px;")
        country = country_cell.get_text(strip=True).split("Min")[0].strip() if country_cell else "Unknown Country"

        cond_cell = item.find("td", {"style": "text-align: center;", "width": "110px"})
        condition_quant = cond_cell.get_text(strip=True).split("(") if cond_cell else ["Unknown", "1"]
        condition = condition_quant[0].strip()
        quantity = condition_quant[1][0] if len(condition_quant) > 1 else "1"

        store_id_match = re.search(store_in_url_pattern, store_link)
        store_id = store_id_match.group(0) if store_id_match else "unknown_store_id"

        stores[store_id] = {
            "_id": store_id,
            "name": store_name,
            "url": store_link,
            "country": country,
        }

        listings[listing_id] = {
            "_id": listing_id,
            "fig_id": figure_id,
            "url": listing_link,
            "price": price,
            "condition": condition,
            "quantity": quantity,
            "store_id": store_id
        }

    # Build minifig object
    minifig = {
        "_id": figure_id,
        "name": figure_name,
        "image": fig_image_url,
        "listings": list(listings.keys())
    }

    return minifig, listings, stores


def fetch_bricklink_data(figs, session, request_count):
    """Fetch data for a list of figs using the existing session."""
    params = {"rpp": "500", "iconly": 0}
    encoded_params = urllib.parse.quote(json.dumps(params))

    headers = {
        "User-Agent": ua.random,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                  "image/avif,image/webp,*/*;q=0.8",
    }

    accumulate_minifigs = []
    accumulate_listings = []
    accumulate_stores = []

    # We'll call our 'async fetch_and_render(...)' via session.run() in a loop
    for i in range(math.ceil(request_count)):
        try:
            print(f"Fetching {figs[i]['ITEMID']}...", end=", ")
        except Exception as e:
            print(f"Failed to fetch {figs[i]['ITEMID']}: {e}")
            break
        url = f"https://www.bricklink.com/v2/catalog/catalogitem.page?M={figs[i]['ITEMID']}#T=S&O={encoded_params}"
        soup_success = False
        while(not soup_success):
            soup_success = True # DISABLE IT FOR NOW
            # Build a zero-arg callable that returns our coroutine
            # This is necessary for session.run(...) to schedule it
            def fetch_job():
                return fetch_and_render(session, url, headers, retries=3, timeout=30)

            # `session.run` returns a list of results. We only have one job, so index 0
            rendered_html = session.run(fetch_job)[0]
            if rendered_html is None:
                # Retry failed, skip
                print(f"Failed to render {url} after retries.")
                continue



            # Once we have the rendered_html, parse it with soupify
            try:
                minifig, listings, stores = soupify(rendered_html)
                if(minifig and listings and stores):
                    accumulate_minifigs.append(minifig)
                    accumulate_listings.append(listings)
                    accumulate_stores.append(stores)
                else: 
                    print(f"No data found for: {figs[i]['ITEMID']}")
                soup_success = True
            except Exception as e:
                print(f"Failed to parse {url}: {e}")

    return accumulate_minifigs, accumulate_listings, accumulate_stores

    # rendered_html = session.run(fetch_and_render)[0] # one subroutine, index the first response to it
    

# --- Usage in Jupyter ---
import nest_asyncio
nest_asyncio.apply()

# Now you can safely call this function:
all_listings = []
all_stores = []
all_minifigs = []
# minifig, listings, stores = fetch_bricklink_data("sw0007")

# print(minifig)
# print(listings)
# all_listings.append(listings)
# all_stores.append(stores)
# all_minifigs.append(minifig)


# minifig, listings, stores = fetch_bricklink_data(fig_data[0]["ITEMID"])


# i = random.uniform(1)
print(len(fig_data))

i = 0
while(i < len(fig_data)):
    # time.sleep(random.uniform(1, 3))
    session = AsyncHTMLSession()
    request_count = math.ceil(random.uniform(2, 6))
    stop_index = min(i+request_count, len(fig_data))
    print(stop_index)
    accumulate_minifig, accumulate_listings, accumulate_stores = fetch_bricklink_data(fig_data[i:stop_index:1], session, request_count)
    if(accumulate_minifig and accumulate_listings and accumulate_stores):
        for fig in accumulate_minifig:
            all_minifigs.append(fig)
        for store in accumulate_stores: 
            all_stores.append(store)
        for listing in accumulate_listings:
            all_listings.append(listing)
    i+=request_count
    await session.close()
    # else:
    #     print(f"No data found for: {fig['ITEMID']}")
    
print(all_minifigs)
print(all_stores)
print(all_listings)

# for fig in all_minifigs:
#     print(fig)
# for stores in all_stores:
#     print(stores)
# for listings in all_listings:
#     print(listings)

# print(minifig)
# print(listings)
# all_listings.append(listings)
# all_stores.append(stores)
# all_minifigs.append(minifig)
