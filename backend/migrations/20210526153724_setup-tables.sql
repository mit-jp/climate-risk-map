-- States and counties
CREATE TABLE state (
    id SMALLINT NOT NULL UNIQUE,
    name VARCHAR(70) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE county (
    id SMALLINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    state SMALLINT NOT NULL,
    PRIMARY KEY (state, id),
    FOREIGN KEY(state) REFERENCES state(id)
);

-- Datasets
CREATE TABLE data_source (
    id SERIAL NOT NULL,
    name VARCHAR(200) NOT NULL UNIQUE,
    description VARCHAR(10000) NOT NULL,
    link VARCHAR(3000) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE dataset (
    id SERIAL NOT NULL,
    short_name VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(2000) NOT NULL,
    units VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE county_data (
    dataset INT NOT NULL,
    source SMALLINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    state_id SMALLINT NOT NULL,
    county_id SMALLINT NOT NULL,
    value FLOAT,
    PRIMARY KEY (
        dataset,
        source,
        start_date,
        end_date,
        state_id,
        county_id
    ),
    FOREIGN KEY (dataset) REFERENCES dataset(id),
    FOREIGN KEY (source) REFERENCES data_source(id),
    FOREIGN KEY (state_id, county_id) REFERENCES county(state, id)
);

-- Map visualizations
CREATE TABLE map_type (
    id SERIAL NOT NULL,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE color_palette (
    id SERIAL NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE scale_type (
    id SERIAL NOT NULL,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE formatter_type (
    id SERIAL NOT NULL,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE map_visualization (
    id SERIAL NOT NULL,
    dataset INT NOT NULL,
    map_type SMALLINT NOT NULL,
    legend_ticks SMALLINT,
    should_normalize BOOLEAN NOT NULL,
    color_palette SMALLINT NOT NULL,
    reverse_scale BOOLEAN NOT NULL DEFAULT FALSE,
    invert_normalized BOOLEAN NOT NULL DEFAULT FALSE,
    scale_type SMALLINT NOT NULL,
    formatter_type SMALLINT NOT NULL,
    decimals SMALLINT NOT NULL DEFAULT 0,
    legend_formatter_type SMALLINT,
    legend_decimals SMALLINT,
    PRIMARY KEY (id),
    FOREIGN KEY (map_type) REFERENCES map_type(id),
    FOREIGN KEY (color_palette) REFERENCES color_palette(id),
    FOREIGN KEY (dataset) REFERENCES dataset(id),
    FOREIGN KEY (formatter_type) REFERENCES formatter_type(id)
);

CREATE TABLE scale_domain (
    map_visualization INT NOT NULL,
    value FLOAT NOT NULL,
    FOREIGN KEY (map_visualization) REFERENCES map_visualization(id)
);

CREATE TABLE data_category (
    id SERIAL NOT NULL,
    "order" SMALLINT NOT NULL UNIQUE,
    name VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE map_visualization_collection (
    map_visualization INT NOT NULL,
    category SMALLINT NOT NULL,
    "order" SMALLINT NOT NULL,
    PRIMARY KEY (category, map_visualization),
    FOREIGN KEY (map_visualization) REFERENCES map_visualization(id),
    FOREIGN KEY (category) REFERENCES data_category(id)
);

CREATE INDEX ON map_visualization_collection ("order");