import csv
import json
from collections import defaultdict

# Define input and output files
input_file = "../public/polling_stations.csv"
output_file = "../public/polling_stations.geojson"

# Initialize GeoJSON structure
geojson = {
    "type": "FeatureCollection",
    "features": []
}

# Dictionary to group rows by coordinates
coord_groups = defaultdict(list)

# Read the CSV and group by coordinates
with open(input_file, 'r', encoding='utf-8') as infile:
    # Read the CSV
    reader = csv.DictReader(infile)
    
    # Process each row
    for row in reader:
        # Skip rows without valid coordinates
        if not row.get('latitude') or not row.get('longitude'):
            continue
            
        try:
            # Convert coordinates to float and create a tuple for dictionary key
            coords_key = (float(row['longitude']), float(row['latitude']))
            
            # Add the row to the appropriate coordinate group
            coord_groups[coords_key].append(row)
            
        except (ValueError, KeyError) as e:
            print(f"Error processing row: {row}")
            print(f"Error details: {e}")
            continue

# Create a feature for each unique coordinate
for coords, rows in coord_groups.items():
    # Create GeoJSON feature
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": list(coords)  # Convert tuple back to list [longitude, latitude]
        },
        "properties": {
            "station_name": rows[0]["station_name"],
            "station_count": len(rows),
            "district": rows[0]["district"],
            "maps_url": rows[0].get("maps", ""),  # Use get() to handle missing columns
            "rooms": [],
            "details": []
        }
    }
    
    # Add all room numbers from this location
    unique_rooms = set()
    for row in rows:
        if "room" in row and row["room"]:
            unique_rooms.add(row["room"])
    
    feature["properties"]["rooms"] = sorted(list(unique_rooms))
    
    # Add detailed information about each polling station at this location
    for row in rows:
        station_details = {
            "station_number": row.get("station_number", ""),
            "religion": row.get("religion", ""),
            "gender": row.get("gender", ""),
            "room": row.get("room", ""),
            "registry_range": f"{row.get('from_register', '')} - {row.get('to_register', '')}" 
        }
        feature["properties"]["details"].append(station_details)
    
    # Add the feature to the collection
    geojson["features"].append(feature)

# Write the GeoJSON file
with open(output_file, 'w', encoding='utf-8') as outfile:
    json.dump(geojson, outfile, ensure_ascii=False, indent=2)

print(f"Conversion completed! GeoJSON file created: {output_file}")
print(f"Created {len(geojson['features'])} unique location features from {sum(len(rows) for rows in coord_groups.values())} original rows.")
