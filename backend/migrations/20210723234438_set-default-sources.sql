ALTER TABLE
    map_visualization RENAME COLUMN default_dataset TO default_source;

-- All ERA5 data uses ERA5 as the default source
UPDATE
    map_visualization
SET
    default_source = 2
WHERE
    dataset IN (1, 3, 4, 5, 6, 7, 8, 9, 22);