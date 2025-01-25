import xml.etree.ElementTree as ET

input_file = "./Minifigures.xml"
output_file = "./starwarsMinifigures.xml"
# Parse the XML data
tree = ET.parse(input_file)


root = tree.getroot()

filtered_root = ET.Element("CATALOG")

# Iterate over each ITEM
for item in root.findall('ITEM'):
    category = item.find('CATEGORY').text if item.find('CATEGORY') is not None else "N/A"
    if category == "65":
        if category is not None:
            filtered_root.append(item)

filtered_tree = ET.ElementTree(filtered_root)
filtered_tree.write(output_file, encoding="utf-8", xml_declaration=True)