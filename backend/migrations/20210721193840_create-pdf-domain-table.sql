CREATE TABLE pdf_domain (
    map_visualization int4 NOT NULL REFERENCES map_visualization(id),
    value float8 NOT NULL
);

INSERT INTO
    pdf_domain (map_visualization, value)
VALUES
    (35, 0),
    (35, 100),
    (36, 0),
    (36, 100),
    (37, 0),
    (37, 100),
    (38, 0),
    (38, 100),
    (39, 0),
    (39, 100),
    (40, 0),
    (40, 100),
    (41, 0),
    (41, 100),
    (42, 0),
    (42, 100),
    (43, 0),
    (43, 100),
    (44, 0),
    (44, 100),
    (45, 0),
    (45, 100),
    (46, 0),
    (46, 100),
    (47, 0),
    (47, 100),
    (48, 0),
    (48, 100),
    (49, 0),
    (49, 100),
    (50, 0),
    (50, 100),
    (51, 0),
    (51, 100),
    (52, 0),
    (52, 100),
    (53, 0),
    (53, 100),
    (54, 0),
    (54, 100),
    (55, 0),
    (55, 100),
    (56, 0),
    (56, 100),
    (57, 0),
    (57, 100),
    (58, 0),
    (58, 100),
    (59, 0),
    (59, 100),
    (60, 0),
    (60, 100),
    (61, 0),
    (61, 100),
    (62, 0),
    (62, 100),
    (63, 0),
    (63, 100);