INSERT INTO
    map_visualization (
        dataset,
        map_type,
        color_palette,
        scale_type,
        formatter_type,
        decimals
    )
VALUES
    (91, 1, 45, 2, 4, 1);

INSERT INTO
    scale_domain (map_visualization, value)
VALUES
    (93, 0),
    (93, 1);

INSERT INTO
    map_visualization_collection ("map_visualization", "category", "order")
VALUES
    (93, 2, 20);