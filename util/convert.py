# Simple script to read in "Reshooting John Hinde.kml" from file in this directory and convert to JSON.
import os
import xml.etree.ElementTree as ET
import json

file_name = "./Reshooting John Hinde.kml"
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
full_file_path = os.path.join(__location__, file_name)
ns = '{http://www.opengis.net/kml/2.2}' # KML is namespaced

# Output JS format is in locations.json
out_js = {}
out_js["type"] = "FeatureCollection"
arr = []
out_js["features"] = []

# Parse XML, adding to json as you go. Format is in locations.json
root = ET.parse(full_file_path).getroot()
for document in root.findall(ns + 'Document'):
    for folder in document.findall(ns + 'Folder'):
        for placemark in folder.findall(ns + 'Placemark'):
            properties = {}
            feature = {'type': 'Feature', "properties": properties}
            feature['geometry'] = {'type': 'Point'}
            # Title
            title = ""
            name = placemark.find(ns + 'name')
            if (name is not None):
                title = name.text
            properties['name'] = title
            # Image Src
            exData = placemark.find(ns + 'ExtendedData')
            image_src = ""
            if (exData is not None):
                src = exData.find(ns + 'Data').find(ns + 'value')
                image_src = src.text
                if (" " in image_src):
                    image_src = image_src.split(" ")[-1]
            properties["image_src"] = image_src
            # Description
            description = placemark.find(ns + 'description')
            if (description is not None):
                desc_arr = description.text.split('<br><br>')
                caption = " "
                # Find the best description
                for desc in desc_arr:
                    if ("https" not in desc):
                        caption = desc
                properties['description'] = caption
            # Long & Lat.
            coordinates = placemark.find(ns + 'Point').find(ns + 'coordinates').text.strip()
            num_coords = coordinates.split(',')
            feature['geometry'] = {'type': 'Point', "coordinates": [float(num_coords[0]), float(num_coords[1])]}
            out_js["features"].append(feature)
            #print("-------------------")
            #print("Name: {0}".format(title))
            #print("Image Src: {0}".format(image_src))
            #print("Desc: : {0}".format(caption))
            #print("^^^^^^^^^^^^^^^^^^^")
json_data = json.dumps(out_js, indent=4)
print(json_data)