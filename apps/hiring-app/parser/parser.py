import sys
import json
import pypdf

def extract_embedded_json(pdf_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        
        # Look for our specific standardized attachment name
        if "metadata_payload.json" in reader.attachments:
            # Extract raw binary bytes and decode to string
            binary_data = reader.attachments["metadata_payload.json"]
            raw_json = binary_data[0].decode('utf-8')
            
            # Print to stdout so the Node.js parent process can capture it
            print(raw_json)
            sys.exit(0)
        else:
            print(json.dumps({"error": "No structured JSON metadata found in this PDF."}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_embedded_json(sys.argv[1])
    else:
        print(json.dumps({"error": "No file path provided."}))
        sys.exit(1)
        