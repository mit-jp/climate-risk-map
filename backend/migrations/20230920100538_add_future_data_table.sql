-- setup table for models, as each dataset can have multiple models
CREATE TABLE future_model (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    dataset INT NOT NULL,
    source SMALLINT NOT NULL,
    domain float8 [] NOT NULL DEFAULT '{}',
    PRIMARY KEY(id),
    FOREIGN KEY(dataset) REFERENCES dataset(id),
    FOREIGN KEY(source) REFERENCES data_source(id)
);

-- each year will have a different confidence interval, so setup tables to store that information
-- stores upper ci for a county/country
CREATE TABLE ci_above (
    id SERIAL NOT NULL,
    model INT NOT NULL,
    geo_id SMALLINT NOT NULL,
    PRIMARY KEY (id)
);

-- stores lower ci for a county/country
CREATE TABLE ci_below (
    id SERIAL NOT NULL,
    model INT NOT NULL,
    geo_id SMALLINT NOT NULL,
    PRIMARY KEY (id)
);

-- setup table for future/predictive data
CREATE TABLE future_data (
    model INT NOT NULL,
    ci_above INT,
    ci_below INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    interval SMALLINT NOT NULL,
    id SMALLINT NOT NULL,
    geography_type INT NOT NULL,
    PRIMARY KEY (
        model,
        start_date,
        end_date,
        id
    ),
    FOREIGN KEY (model) REFERENCES future_model(id),
    FOREIGN KEY (ci_above) REFERENCES ci_above(id),
    FOREIGN KEY (ci_below) REFERENCES ci_below(id),
    CONSTRAINT data_geo_ids_fkey FOREIGN KEY (geography_type, id) REFERENCES geo_id (geography_type, id)
);

-- add columns for years up to 2200
DO $$
DECLARE 
cur_year INT := 2024;
BEGIN
WHILE cur_year <2201 LOOP
EXECUTE 'ALTER TABLE future_data ADD value_' || cur_year || ' FLOAT';
cur_year := cur_year+1;
END LOOP;
END$$;