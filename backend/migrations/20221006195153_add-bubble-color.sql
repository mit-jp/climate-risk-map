ALTER TABLE
    map_visualization
ADD
    COLUMN bubble_color text NOT NULL DEFAULT '#000000';

UPDATE
    map_visualization
SET
    bubble_color = 'rgb(34, 139, 69)'
FROM
    map_visualization_collection,
    data_category
WHERE
    map_visualization_collection.map_visualization = map_visualization.id
    AND map_visualization_collection.category = data_category.id
    AND data_category.name != 'health';