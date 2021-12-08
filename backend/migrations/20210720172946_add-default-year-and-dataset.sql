ALTER TABLE
    map_visualization
ADD
    COLUMN default_start_date DATE,
ADD
    COLUMN default_end_date DATE,
ADD
    COLUMN default_dataset INTEGER REFERENCES dataset(id);

UPDATE
    map_visualization
SET
    default_start_date = '2000-01-01',
    default_end_date = '2019-01-01'
WHERE
    id = 3;

UPDATE
    map_visualization
SET
    default_start_date = '2010-01-01',
    default_end_date = '2015-12-31'
WHERE
    id = 1;