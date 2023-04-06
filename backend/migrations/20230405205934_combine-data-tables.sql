-- add a geography_type column do the usa_county_data table
ALTER TABLE
    usa_county_data
ADD
    COLUMN geography_type INT NOT NULL DEFAULT 1 REFERENCES geography_type(id);

-- add a geography_type column to the country_data table
ALTER TABLE
    country_data
ADD
    COLUMN geography_type INT NOT NULL DEFAULT 2 REFERENCES geography_type(id);

-- combine the usa_county_table state_id and county_id into one column called "id"
ALTER TABLE
    usa_county_data
ADD
    COLUMN id INT NOT NULL DEFAULT 0;

-- populate the id column with the state_id and county_id
UPDATE
    usa_county_data
SET
    id = (state_id * 1000) + county_id;

-- remove the county_id and state_id columns
ALTER TABLE
    usa_county_data DROP COLUMN county_id,
    DROP COLUMN state_id;

-- move the country_data into the usa_county_data table
INSERT INTO
    usa_county_data (
        id,
        geography_type,
        start_date,
        end_date,
        source,
        dataset,
        value
    )
SELECT
    country_id,
    geography_type,
    start_date,
    end_date,
    source,
    dataset,
    value
FROM
    country_data;

-- remove the country_data table
DROP TABLE country_data;

-- rename usa_county_data to data
ALTER TABLE
    usa_county_data RENAME TO data;

-- remove the default value for geography_type
ALTER TABLE
    data
ALTER COLUMN
    geography_type DROP DEFAULT;

-- remove the default value for id
ALTER TABLE
    data
ALTER COLUMN
    id DROP DEFAULT;

-- make the data table primary key use geography type
ALTER TABLE
    data
ADD
    PRIMARY KEY (
        dataset,
        source,
        start_date,
        end_date,
        geography_type,
        id
    );