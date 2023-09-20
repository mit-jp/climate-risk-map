UPDATE
    subcategory
SET
    "order" = 3
WHERE
    "order" = 2;

INSERT INTO
    subcategory (name, "order")
VALUES
    ('Transitional Risk Metrics', 2);

UPDATE
    map_visualization
SET
    subcategory = 3
WHERE
    id IN (64, 90);

UPDATE
    data_category
SET
    name = 'combinatory metrics'
WHERE
    "order" = -1;

UPDATE
    subcategory
SET
    name = 'Diversity and Equity Metrics'
WHERE
    name = 'Environmental Equity';

UPDATE
    map_visualization
SET
    subcategory = 3
WHERE
    id = 64;