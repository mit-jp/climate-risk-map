-- combine the usa_county and country tables into a single table with a column to differentiate the geography_type
-- this is to simplify the queries and make it easier to add new geographies in the future
CREATE TABLE geo_id (
    geography_type INT NOT NULL REFERENCES geography_type (id),
    id INT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (geography_type, id)
);

-- copy data from usa_county, combining id and state into a single id
INSERT INTO
    geo_id (geography_type, id, name)
SELECT
    1,
    state * 1000 + id,
    name
FROM
    usa_county;

-- copy data from country
INSERT INTO
    geo_id (geography_type, id, name)
SELECT
    2,
    id,
    name
FROM
    country;

-- add states into the geo_id table
INSERT INTO
    geography_type (name)
VALUES
    ('usa-state');

INSERT INTO
    geo_id (geography_type, id, name)
SELECT
    3,
    id,
    name
FROM
    usa_state;

-- drop the old geo id tables
DROP TABLE usa_county;

DROP TABLE usa_state;

DROP TABLE country;