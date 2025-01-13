#import requests  
import  requests
import  json
import  pandas              as pd
import  shapely.geometry    as geometry
from    shapely.ops         import linemerge, unary_union, polygonize
from    shapely.geometry    import Polygon, MultiPolygon




overpass_url = "https://lz4.overpass-api.de/api/interpreter"

# Define the query to retrieve administrative areas in Munich
query_admin = """
[out:json][timeout:25];
area["name"="München"]->.searchArea;
(
  relation["admin_level"="9"]["boundary"="administrative"](area.searchArea);
);
out geom;
"""

query_postal = """
[out:json][timeout:25];
area["name"="München"]->.searchArea;
(
  relation["admin_level"="10"]["boundary"="postal_code"](area.searchArea);
);
out geom;
"""

# Define the parameters for the GET request
params = {
    'data': query_admin
    #'data': query_postal
}

# Send a GET request to the Overpass API with the query
response = requests.get(overpass_url, params=params)
data = response.json()


# Printing the keys of the 'data' dictionary to see the available top-level keys
print("Keys of the 'data' dictionary:")
print(data.keys())

# Printing the keys of the first element in the 'elements' list to inspect its structure
print("Keys of the first element in the 'elements' list:")
print(data['elements'][0].keys())

# Initialize empty lists to store polygons and names
polygons = []
names = []

# Iterate through elements in the 'data' dictionary
for element in data['elements']:
    # Check if the element is of type 'relation'
    if element.get('type') == 'relation':
        # Initialize an empty list to store LineStrings
        lss = []  # Convert ways to LineStrings
        # Iterate through members of the element
        for member in element['members']:
            if member['type'] == 'way':
                ls_coords = []  # Reset the LineString coordinate list
                nodes = member['geometry']

                # Iterate through nodes and extract lon and lat
                for point in nodes:
                    lon = point['lon']
                    lat = point['lat']
                    ls_coords.append((lon, lat))  # Append coordinate tuple

                # Create a LineString from the coordinates and add it to the list
                lss.append(geometry.LineString(ls_coords))

        # Merge the LineStrings into one
        merged = linemerge([*lss])

        # Convert the merged LineStrings into a MultiLineString
        borders = unary_union(merged)

        # Polygonize the MultiLineString to create polygons
        polygon = list(polygonize(borders))

        # Append the resulting polygon and the name from tags to respective lists
        polygons.append(polygon)
        names.append(element['tags']['name'])

# Create a list of MultiPolygons
multipolygons = [MultiPolygon(polygon) for polygon in polygons]

# Create a GeoDataFrame
geo_data = {'Name': names, 'geometry': multipolygons}
print(geo_data)
import json

# Assuming names is a list of names and multipolygons is a list of MultiPolygon geometries

# Create a list to hold feature dictionaries
features = []

# Iterate over each name and corresponding multipolygon
for name, multipolygon in zip(names, multipolygons):
    # Convert the multipolygon to GeoJSON format
    geojson_geom = multipolygon.__geo_interface__
    
    # Create a feature dictionary
    feature = {
        "type": "Feature",
        "properties": {"Name": name},
        "geometry": geojson_geom
    }
    
    # Add the feature to the features list
    features.append(feature)

# Create a feature collection dictionary
feature_collection = {
    "type": "FeatureCollection",
    "features": features
}

# Write the feature collection dictionary to a GeoJSON file
with open("C:/Users/-/Documents/output_postal.geojson", "w") as f:
    json.dump(feature_collection, f)
