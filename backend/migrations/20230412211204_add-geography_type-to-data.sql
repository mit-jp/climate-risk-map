ALTER TABLE
    data
ADD
    COLUMN geography_type INT;

-- Fill column with values from the corresponding dataset
UPDATE
    data
SET
    geography_type = dataset.geography_type
FROM
    dataset
WHERE
    dataset.id = data.dataset;

ALTER TABLE
    data
ALTER COLUMN
    geography_type
SET
    NOT NULL;

-- Add composite foreign key to geo_id (geography_type, id)
ALTER TABLE
    data
ADD
    CONSTRAINT data_geo_ids_fkey FOREIGN KEY (geography_type, id) REFERENCES geo_id (geography_type, id);