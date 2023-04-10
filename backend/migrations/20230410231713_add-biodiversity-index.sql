-- Add Biodiversity index source
INSERT INTO
    data_source (name, description, link)
VALUES
    ('Biodiversity Index', '', '');

-- Add Biodiversity index data set
INSERT INTO
    dataset (
        short_name,
        name,
        description,
        units,
        geography_type
    )
VALUES
    (
        'biodiversity_index',
        'Biodiversity Index',
        'Biodiversity Index',
        '',
        2
    );