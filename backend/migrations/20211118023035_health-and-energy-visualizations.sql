-- Add percent formatter type
INSERT INTO
    formatter_type (name)
VALUES
    ('percent');

-- Add estimated health and energy map visualizations
INSERT INTO
    map_visualization (
        dataset,
        map_type,
        should_normalize,
        color_palette,
        scale_type,
        formatter_type,
        decimals,
        subcategory
    )
VALUES
    -- health
    (69, 1, TRUE, 45, 5, 3, 0, 1),
    (70, 2, FALSE, 45, 5, 3, 0, NULL),
    (71, 2, FALSE, 45, 5, 3, 0, NULL),
    (72, 2, FALSE, 45, 5, 3, 0, NULL),
    (73, 2, FALSE, 45, 5, 3, 0, NULL),
    (74, 2, FALSE, 45, 5, 3, 0, NULL),
    (75, 1, FALSE, 45, 2, 3, 1, NULL),
    (76, 1, FALSE, 45, 2, 3, 1, NULL),
    (77, 1, FALSE, 45, 2, 3, 1, NULL),
    (78, 1, FALSE, 45, 2, 3, 1, NULL),
    (79, 1, FALSE, 45, 2, 3, 1, NULL),
    (80, 1, FALSE, 45, 2, 3, 1, NULL),
    (81, 1, FALSE, 45, 2, 3, 1, NULL),
    (82, 1, FALSE, 45, 2, 3, 1, NULL),
    (83, 1, FALSE, 45, 2, 3, 1, NULL),
    (84, 1, FALSE, 45, 2, 3, 1, NULL),
    -- energy
    (85, 1, FALSE, 4, 2, 1, 0, NULL),
    (86, 1, FALSE, 4, 2, 1, 0, NULL),
    (87, 1, FALSE, 4, 2, 1, 0, NULL),
    (88, 1, TRUE, 4, 2, 4, 1, 1),
    (89, 1, FALSE, 4, 2, 4, 1, NULL),
    (90, 1, FALSE, 4, 2, 4, 1, NULL);