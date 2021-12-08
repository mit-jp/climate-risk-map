-- Set up subcategories (needed for Risk metrics tab)
CREATE TABLE subcategory (
    id SERIAL PRIMARY KEY,
    name varchar(100) NOT NULL,
    "order" int NOT NULL UNIQUE
);

INSERT INTO
    subcategory (name, "order")
VALUES
    ('Risk Metrics', 1),
    ('Environmental Justice', 2);

-- Enable subcategories for maps, and also custom names that differ from the dataset name
-- (Both needed for Risk metrics tab)
ALTER TABLE
    map_visualization
ADD
    COLUMN name VARCHAR(100),
ADD
    COLUMN subcategory INT REFERENCES subcategory(id);

-- Add Risk metrics tab
INSERT INTO
    data_category ("order", name)
VALUES
    (-1, 'risk metrics');

-- Add some custom maps for the Risk metrics tab that have different names than their dataset
-- 10 Year Flood Risk -> Flood Risk
INSERT INTO
    map_visualization (
        "dataset",
        "map_type",
        "should_normalize",
        "color_palette",
        "reverse_scale",
        "invert_normalized",
        "scale_type",
        "formatter_type",
        "decimals",
        "show_pdf",
        "name",
        "subcategory"
    )
VALUES
    (
        10,
        1,
        't',
        1,
        'f',
        'f',
        2,
        3,
        0,
        't',
        'Flood Risk',
        1
    );

-- Maximum Month Temperature -> Temperature Stress Indicator
INSERT INTO
    map_visualization (
        "dataset",
        "map_type",
        "should_normalize",
        "color_palette",
        "reverse_scale",
        "invert_normalized",
        "scale_type",
        "formatter_type",
        "decimals",
        "show_pdf",
        "default_source",
        "name",
        "subcategory"
    )
VALUES
    (
        22,
        1,
        't',
        15,
        't',
        'f',
        1,
        3,
        0,
        't',
        2,
        'Temperature Stress Indicator',
        1
    );

-- Finish setting up Risk Metrics tab collection, and subcategories
INSERT INTO
    map_visualization_collection (map_visualization, category, "order")
VALUES
    (1, 8, 1),
    (2, 8, 2),
    (69, 8, 3),
    (15, 8, 4),
    (16, 8, 5),
    (70, 8, 6),
    (28, 8, 7),
    (29, 8, 8),
    (30, 8, 9),
    (31, 8, 10),
    (32, 8, 11),
    (64, 8, 12);

UPDATE
    map_visualization
SET
    subcategory = 1
WHERE
    id IN (1, 2, 69, 15, 16, 70, 28);

UPDATE
    map_visualization
SET
    subcategory = 2
WHERE
    id IN (29, 30, 31, 32, 64);