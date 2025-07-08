-- Create a master key if you don't have one already
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'Just1fied!';

-- Create a database scoped credential with Shared Access Signature (SAS)
CREATE DATABASE SCOPED CREDENTIAL BlobStorageCredential
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
SECRET = 'sv=2024-11-04&ss=bf&srt=co&sp=rwdlaciytfx&se=2026-04-19T08:51:58Z&st=2025-04-19T00:51:58Z&spr=https&sig=%2FFYqiPC%2BhN3wG6qNc6XSPM1VkmalVhNlxUFdKyZ43c0%3D';

-- Create an external data source that uses this credential
CREATE EXTERNAL DATA SOURCE GeoJsonBlob
WITH (
    TYPE = BLOB_STORAGE,
    LOCATION = 'https://visitationstorage.blob.core.windows.net/geojsondata',
    CREDENTIAL = BlobStorageCredential
); 