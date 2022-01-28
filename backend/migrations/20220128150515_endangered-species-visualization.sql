INSERT INTO
    map_visualization (
        dataset,
        map_type,
        color_palette,
        scale_type,
        formatter_type,
        decimals,
        show_pdf,
        subcategory
    )
VALUES
    (94, 1, 46, 5, 3, 0, FALSE, 1);

INSERT INTO
    scale_domain (map_visualization, value)
VALUES
    (96, 0),
    (96, 1000);

INSERT INTO
    map_visualization_collection ("map_visualization", "category", "order")
VALUES
    (96, 2, 50),
    (96, 8, 50);