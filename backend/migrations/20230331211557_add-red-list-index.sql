-- Add red list index source
INSERT INTO
    data_source (name, description, link)
VALUES
    ('Red List Index', '', '');

-- Add red list index data set
INSERT INTO
    dataset (short_name, name, description, units)
VALUES
    (
        'red_list_index',
        'Red List Index',
        'Red List Index',
        ''
    );