from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def fetch_spans_c1(url: str):
    """
    Launch a headless browser, navigate to the given URL,
    wait for the content to load, and scrape all <span class="c1"> elements.
    """
    with sync_playwright() as p:
        # Launch headless Chromium
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the published Google Doc URL
        page.goto(url)

        # Optional: Wait for the "c1" spans to appear (in case they take time to load)
        try:
            page.wait_for_selector("span.c1", timeout=15000)  # up to 15s
        except:
            print("Timed out waiting for span.c1 elements.")
        
        # Get the entire rendered HTML
        html_content = page.content()

        # Close the browser
        browser.close()

    # Parse the final HTML with BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")
    c1_spans = soup.find_all("span", class_="c1")
    return [span.get_text() for span in c1_spans]

if __name__ == "__main__":
    # Replace this with your published Google Doc URL
    doc_url = "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub"
    spans_text = fetch_spans_c1(doc_url)

    print(f"Found {len(spans_text)} <span class='c1'> elements:")
    for idx, text in enumerate(spans_text, start=1):
        print(f"{idx}. {text}")
