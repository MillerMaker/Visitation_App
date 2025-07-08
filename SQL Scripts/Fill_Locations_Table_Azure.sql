INSERT INTO Location (Hash, Number, Street, Unit, City, State, Country, Postcode, Point)
SELECT 
    JSON_VALUE(value, '$.properties.hash'),
    JSON_VALUE(value, '$.properties.number'),
    JSON_VALUE(value, '$.properties.street'),
    JSON_VALUE(value, '$.properties.unit'),
    JSON_VALUE(value, '$.properties.city'),
    'Georgia',
    'United States',
    JSON_VALUE(value, '$.properties.postcode'),
    geography::Point(
        JSON_VALUE(value, '$.geometry.coordinates[1]'),
        JSON_VALUE(value, '$.geometry.coordinates[0]'),
        4326
    )
FROM 
    OPENROWSET(
        BULK 'source.geojson',
        DATA_SOURCE = 'GeoJsonBlob',
        SINGLE_CLOB
    ) AS JSON_FILE
    CROSS APPLY OPENJSON(JSON_FILE.BulkColumn) AS LocationData;