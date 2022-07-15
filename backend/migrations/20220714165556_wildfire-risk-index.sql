-- Add normalized wildfire risk to the risk tab
UPDATE
    map_visualization
SET
    "subcategory" = 1
WHERE
    "id" = 97;

INSERT INTO
    map_visualization_collection ("map_visualization", "category", "order")
VALUES
    (97, 8, 30);