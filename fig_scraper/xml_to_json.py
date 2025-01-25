import xml.etree.ElementTree as ET
import json

def xml_to_json(file_path):
    # Parse the XML file
    tree = ET.parse(file_path)
    root = tree.getroot()

    # List to hold converted items
    items = []

    # Iterate over all ITEM elements
    for item in root.findall('ITEM'):
        item_dict = {}
        for child in item:
            # Add each child element to the dictionary
            item_dict[child.tag] = child.text
        # Append the dictionary to the list
        items.append(item_dict)

    return items

# Path to the XML file
file_path = "starwarsMinifigures.xml"

# Convert XML to JSON list of objects
json_list = xml_to_json(file_path)

# Convert the Python list to a JSON string for pretty printing
json_output = json.dumps(json_list, indent=4)

# Optionally, save JSON to a file
output_file = "swFigs.json"
with open(output_file, "w") as json_file:
    json_file.write(json_output)
    print(f"JSON data saved to {output_file}")
