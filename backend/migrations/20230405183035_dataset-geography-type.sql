-- remove geography_type from map_visualization and add it to dataset
-- add geography_type to dataset
ALTER TABLE
    dataset
ADD
    COLUMN geography_type INT NOT NULL DEFAULT 1 REFERENCES geography_type(id);

-- red list index is the only global dataset for now
UPDATE
    dataset
SET
    geography_type = 2
WHERE
    short_name = 'red_list_index';

-- require specifying the geography_type explicitly in the future
ALTER TABLE
    dataset
ALTER COLUMN
    geography_type DROP DEFAULT;

-- remove geography_type from map_visualization
ALTER TABLE
    map_visualization DROP COLUMN geography_type;