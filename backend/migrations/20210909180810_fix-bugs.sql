-- Put "population under 18" in the demographics subcategory
UPDATE
    map_visualization
SET
    subcategory = 2
WHERE
    id = 28;

-- Put "employment in fossil fuels" in the risk metrics subcategory
UPDATE
    map_visualization
SET
    subcategory = 1,
    color_palette = 4,
    dataset = 65
WHERE
    id = 64;

-- Swap employment in fossil fuels and renewables employment (the data was assigned to the wrong one)
UPDATE
    dataset
SET
    short_name = '1',
    name = ''
WHERE
    id = 64;

UPDATE
    dataset
SET
    short_name = 'fossil_fuels_employment',
    name = 'Employment in Fossil Fuels'
WHERE
    id = 65;

UPDATE
    dataset
SET
    short_name = 'renewables_employment',
    name = 'Employment in Renewables'
WHERE
    id = 64;

UPDATE
    map_visualization
SET
    dataset = 64
WHERE
    id = 65;

-- Fix "employment in transmission" and "employment in motor vehicles" color scheme
UPDATE
    map_visualization
SET
    color_palette = 4
WHERE
    id IN (67, 68);

-- Add "population density" to risk metrics
UPDATE
    map_visualization
SET
    should_normalize = TRUE
WHERE
    id = 33;

INSERT INTO
    map_visualization_collection (map_visualization, category, "order")
VALUES
    (33, 8, 20);

-- Change "spectral" color palettes to "RdYlBu" to be color blind friendly
UPDATE
    map_visualization
SET
    color_palette = 13
WHERE
    color_palette = 15;

-- Update color for "per capita personal income"
UPDATE
    map_visualization
SET
    color_palette = 7
WHERE
    id = 27;