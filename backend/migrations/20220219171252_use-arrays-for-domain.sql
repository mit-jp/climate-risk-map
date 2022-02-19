-- Use hardcoded arrays instead of table joins for domains
-- It makes them a lot easier to update
ALTER TABLE
    map_visualization
ADD
    color_domain float8 [] NOT NULL DEFAULT '{}',
ADD
    pdf_domain float8 [] NOT NULL DEFAULT '{}';

-- Aggregate existing color domains into arrays
UPDATE
    map_visualization
SET
    color_domain = domain.color_domain
FROM
    (
        SELECT
            map_visualization.id AS map_visualization,
            ARRAY_AGG(scale_domain.value) AS color_domain
        FROM
            map_visualization
            LEFT OUTER JOIN scale_domain ON (
                map_visualization.id = scale_domain.map_visualization
            )
        GROUP BY
            map_visualization.id
        HAVING
            -- skip the ones without domains, so it doesn't insert {NULL}, and instead keeps them NULL
            COUNT(scale_domain.value) > 0
    ) AS domain
WHERE
    domain.map_visualization = map_visualization.id;

-- Aggregate existing pdf domains into arrays
UPDATE
    map_visualization
SET
    pdf_domain = domain.pdf_domain
FROM
    (
        SELECT
            map_visualization.id AS map_visualization,
            ARRAY_AGG(pdf_domain.value) AS pdf_domain
        FROM
            map_visualization
            LEFT OUTER JOIN pdf_domain ON (
                map_visualization.id = pdf_domain.map_visualization
            )
        GROUP BY
            map_visualization.id
        HAVING
            -- skip the ones without domains, so it doesn't insert {NULL}, and instead keeps them NULL
            COUNT(pdf_domain.value) > 0
    ) AS domain
WHERE
    domain.map_visualization = map_visualization.id;

DROP TABLE scale_domain;

DROP TABLE pdf_domain;