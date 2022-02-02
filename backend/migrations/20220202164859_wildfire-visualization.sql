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
    (95, 1, 46, 1, 4, 3);

INSERT INTO
    scale_domain (map_visualization, value)
VALUES
    (97, 0),
    (97, 0.001),
    (97, 0.004);

INSERT INTO
    map_visualization_collection ("map_visualization", "category", "order")
VALUES
    (97, 2, 30);