-- Drop unused column
ALTER TABLE
    map_visualization DROP COLUMN should_normalize;

-- Put PM2.5 and Energy Expenditure as Share of GDP in risk metrics
UPDATE
    map_visualization
SET
    subcategory = 1
WHERE
    id IN (71, 90);

INSERT INTO
    map_visualization_collection ("map_visualization", "category", "order")
VALUES
    -- PM 2.5 normalized
    (71, 8, 0),
    -- Energy Expenditure as Share of GDP
    (90, 8, 15);