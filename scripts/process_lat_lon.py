import csv

# Define input and output files
input_file = "../public/polling_stations_simple.csv"
output_file = "../public/polling_stations.csv"

# Read the CSV and write to a new file
with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8', newline='') as outfile:
    # Read the CSV
    reader = csv.reader(infile)
    
    # Get the header row
    header = next(reader)
    
    # Create a new header with latitude and longitude instead of coordinates
    new_header = header[:-1] + ['latitude', 'longitude']
    
    # Create a writer for the output file
    writer = csv.writer(outfile)
    writer.writerow(new_header)
    
    # Process each row
    for row in reader:
        if len(row) > 0:
            # Get all columns except the coordinates
            new_row = row[:-1]
            
            # Extract coordinates if they exist
            if len(row) > 0 and row[-1]:
                # Remove quotes and split by comma
                coords = row[-1].replace('"', '').split(',')
                
                if len(coords) >= 2:
                    latitude = coords[0].strip()
                    longitude = coords[1].strip()
                    
                    # Add the split coordinates to the new row
                    new_row.extend([latitude, longitude])
                else:
                    # If coordinates are not in expected format, add empty values
                    new_row.extend(['', ''])
            else:
                # If no coordinates column, add empty values
                new_row.extend(['', ''])
                
            # Write the modified row
            writer.writerow(new_row)

print(f"Conversion completed! Output file: {output_file}")