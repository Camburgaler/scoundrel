import json
import logging
import os
import uuid
from pathlib import Path

import boto3
import psycopg2
import psycopg2.extras

psycopg2.extras.register_uuid()
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
)

logging.info("Loading ENV vars")
load_dotenv(dotenv_path="./.env")

# Load ENV
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_BUCKET = os.getenv("R2_BUCKET")
R2_PUBLIC_BASE = os.getenv("R2_PUBLIC_BASE")
NEON_DB_URL = os.getenv("NEON_DB_URL")

if not all([R2_ACCESS_KEY, R2_SECRET_KEY, R2_ENDPOINT, R2_BUCKET, R2_PUBLIC_BASE, NEON_DB_URL]):
    raise Exception("Missing ENV vars")

# Connect to R2 via S3-compatible boto3
logging.info("Connecting to R2")
s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY
)

# Connect to Neon Postgres
# logging.info("Connecting to Neon")
# conn = psycopg2.connect(NEON_DB_URL)
# cursor = conn.cursor()

# Your local folder of images
image_folder = Path("./assets/decks/")

deck_dirs = []
for item in Path(image_folder).iterdir():
    if item.is_dir():
        deck_dirs.append(str(item.name))

for deck in deck_dirs:
    with image_folder.joinpath(deck, "metadata.json").open() as f:
        metadata = json.load(f)
    
    extraArgs = {}
    if metadata['filetype'] == 'svg':
        extraArgs = {'ContentType': 'image/svg+xml'}

    for suit in ["spades", "hearts", "diamonds", "clubs"]:
        for rank in ["ace", "02", "03", "04", "05", "06", "07", "08", "09", "10", "jack", "queen", "king"]:
            s3_key = f"{deck}/{suit}/{rank}.{metadata['filetype']}"
    
            # Construct metadata
            match rank:
                case "ace":
                    value = 1
                case "02":
                    value = 2
                case "03":
                    value = 3
                case "04":
                    value = 4
                case "05":
                    value = 5
                case "06":
                    value = 6
                case "07":
                    value = 7
                case "08":
                    value = 8
                case "09":
                    value = 9
                case "10":
                    value = 10
                case "jack":
                    value = 11
                case "queen":
                    value = 12
                case "king":
                    value = 13

            upload = True
            name = metadata['name']
            if "ttrpg_legacy_" in deck:
                s3_key = "ttrpg_legacy/"
                [_, _, race, color, designNum] = deck.split("_")

                if value in [11, 12, 13]:
                    # race/color/design/rank.png
                    s3_key += f"{race}/{color}/design_{designNum}/{suit}/{rank}.{metadata['filetype']}"

                elif race == "dwarf":
                    # common/color/design/suit/rank.png
                    s3_key += f"common/{color}/design_{designNum}/{suit}/{rank}.{metadata['filetype']}"
                    name = name.replace("Dwarf", "Common")
                else:
                    upload = False

            if upload:
                # Upload to R2
                with image_folder.joinpath(deck, suit, f"{rank}.{metadata['filetype']}").open("rb") as f:
                    logging.info(f"Uploading {s3_key}")
                    s3.upload_fileobj(f, R2_BUCKET, s3_key, ExtraArgs=extraArgs)

                image_url = f"{R2_PUBLIC_BASE}{s3_key}"
                    
                # Insert into Neon
                # logging.info(f"Inserting {s3_key}")
                # cursor.execute("""
                #     INSERT INTO assets (id, type, suit, url, collection, value, source)
                #     VALUES (%s, %s, %s, %s, %s, %s, %s)
                # """, (uuid.uuid4(), 'card_face', suit, image_url, name, value, metadata['source']))
                # logging.info("""
                #     INSERT INTO assets (id, type, suit, url, group, value, source)
                #     VALUES (%s, %s, %s, %s, %s, %s, %s)
                # """, str(uuid.uuid4()), 'card_face', suit, image_url, name, str(value), metadata['source'])

# conn.commit()
# cursor.close()
# conn.close()