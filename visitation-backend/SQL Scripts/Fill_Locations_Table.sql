USE VisitTrackingDB;

-- Enable advanced options
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;

-- Enable Ad Hoc Distributed Queries
EXEC sp_configure 'Ad Hoc Distributed Queries', 1;
RECONFIGURE;

-- Insert data from JSON file
INSERT INTO Location (Hash, Number, Street, Unit, City, State, Country, Postcode, Point)
SELECT 
    JSON_VALUE(LocationData.value, '$.properties.hash'),
    JSON_VALUE(LocationData.value, '$.properties.number'),
    JSON_VALUE(LocationData.value, '$.properties.street'),
    JSON_VALUE(LocationData.value, '$.properties.unit'),
    JSON_VALUE(LocationData.value, '$.properties.city'),
    'Georgia', -- Hardcoded
    'United States', -- Hardcoded
    JSON_VALUE(LocationData.value, '$.properties.postcode'),
    geography::Point(
        JSON_VALUE(LocationData.value, '$.geometry.coordinates[1]'),
        JSON_VALUE(LocationData.value, '$.geometry.coordinates[0]'),
        4326
    )
FROM 
    OPENROWSET (BULK 'C:\Users\Cohen\Desktop\Visitation_App\source.geojson', SINGLE_CLOB) AS JSON_FILE
    CROSS APPLY OPENJSON(JSON_FILE.BulkColumn) AS LocationData;
	
	
	