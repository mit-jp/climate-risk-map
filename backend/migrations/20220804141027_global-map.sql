CREATE TABLE country (
    id SMALLINT PRIMARY KEY,
    NAME text NOT NULL
);

ALTER TABLE
    county_data RENAME TO usa_county_data;

ALTER TABLE
    state RENAME TO usa_state;

ALTER TABLE
    county RENAME TO usa_county;

CREATE TABLE country_data (
    dataset INT NOT NULL,
    source INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    country_id SMALLINT NOT NULL,
    VALUE FLOAT,
    PRIMARY KEY (
        dataset,
        source,
        start_date,
        end_date,
        country_id
    ),
    FOREIGN KEY (dataset) REFERENCES dataset(id),
    FOREIGN KEY (source) REFERENCES data_source(id),
    FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE geography_type (
    id serial PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL
);

INSERT INTO
    geography_type (NAME)
VALUES
    ('usa-county'),
    ('country');

ALTER TABLE
    map_visualization
ADD
    COLUMN geography_type INT NOT NULL DEFAULT 1 REFERENCES geography_type(id);

ALTER TABLE
    data_category
ADD
    COLUMN geography_type INT NOT NULL DEFAULT 1 REFERENCES geography_type(id);