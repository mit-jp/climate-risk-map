UPDATE
    map_visualization
SET
    color_palette = 7,
    scale_type = 1
WHERE
    id = 14;

DELETE FROM
    scale_domain
WHERE
    map_visualization = 14;

INSERT INTO
    scale_domain (map_visualization, value)
VALUES
    (14, 10000),
    (14, 40000),
    (14, 100000);