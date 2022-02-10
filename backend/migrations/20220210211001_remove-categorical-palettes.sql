-- Delete all categorical color palettes
DELETE FROM
    color_palette
WHERE
    name IN (
        'Category10',
        'Accent',
        'Dark2',
        'Paired',
        'Pastel1',
        'Pastel2',
        'Set1',
        'Set2',
        'Set3',
        'Tableau10'
    );

-- Use a sequential instead of a threshold scale because we cannot use threshold scales on the frontend yet
-- Currently, the only threshold scale is being used on GDP, which is a bubble map so it's not using the scale
UPDATE
    map_visualization
SET
    scale_type = 2
WHERE
    scale_type = 4;