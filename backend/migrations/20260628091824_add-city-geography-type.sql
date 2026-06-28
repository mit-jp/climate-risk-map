-- Increase int size for geo ids so city ids can fit
ALTER TABLE
    geo_id
ALTER COLUMN
    id TYPE int8;

-- Add a geography type for US cities
INSERT INTO
    geography_type (name)
VALUES
    ('usa-city');