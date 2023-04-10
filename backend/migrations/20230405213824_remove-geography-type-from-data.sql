ALTER TABLE
    data DROP COLUMN geography_type;

-- add index on the remaining columns
ALTER TABLE
    data
ADD
    PRIMARY KEY (
        dataset,
        source,
        start_date,
        end_date,
        id
    );