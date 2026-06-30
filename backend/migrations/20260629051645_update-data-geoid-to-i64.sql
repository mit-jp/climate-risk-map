-- Increase the geoid size to match the geo_id table
ALTER TABLE
    data
ALTER COLUMN
    id TYPE int8;