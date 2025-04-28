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
load_dotenv(dotenv_path="./.env.local")

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
logging.info("Connecting to Neon")
conn = psycopg2.connect(NEON_DB_URL)
cursor = conn.cursor()

# Your local folder of images
sounds_folder = Path("./src/assets/sounds/")
with sounds_folder.joinpath("metadata.json").open() as f:
    metadata = json.load(f)

for type in ['card', 'dice']:
    sound_files = list(sounds_folder.glob(f"{type}*.wav"))

    for sound_file in sound_files:
        fileNum = sound_file.name.split('.')[0].split('_')[-1]

        logging.info(f"Processing {sound_file}")
        s3_key = f"sounds/{type}/{fileNum}.wav"

        # Upload to R2
        with sounds_folder.joinpath(sound_file.name).open("rb") as f:
            logging.info(f"Uploading {s3_key}")
            s3.upload_fileobj(f, R2_BUCKET, s3_key)

        sound_url = f"{R2_PUBLIC_BASE}{s3_key}"
            
        # Insert into Neon
        logging.info(f"Inserting {s3_key}")
        cursor.execute("""
            INSERT INTO assets (id, type, url, source, collection)
            VALUES (%s, %s, %s, %s, %s)
        """, (uuid.uuid4(), f'sound_{type}', sound_url, metadata['source'], type.capitalize()))
        # logging.info("""
        #     INSERT INTO assets (id, type, url, source, collection)
        #     VALUES (%s, %s, %s, %s, %s)
        # """, str(uuid.uuid4()), f'sound_{type}', sound_url, metadata['source'], type.capitalize())

conn.commit()
cursor.close()
conn.close()