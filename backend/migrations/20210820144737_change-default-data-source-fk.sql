ALTER TABLE
    map_visualization DROP CONSTRAINT map_visualization_default_dataset_fkey,
ADD
    CONSTRAINT fk_default_source FOREIGN KEY (default_source) REFERENCES data_source(id);