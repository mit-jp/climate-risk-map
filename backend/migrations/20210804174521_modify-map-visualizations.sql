ALTER TABLE
    map_visualization
ALTER COLUMN
    legend_formatter_type TYPE INT,
ALTER COLUMN
    formatter_type TYPE INT,
ALTER COLUMN
    scale_type TYPE INT,
ALTER COLUMN
    color_palette TYPE INT,
ALTER COLUMN
    map_type TYPE INT,
ADD
    CONSTRAINT fk_legend_formatter_type FOREIGN KEY (legend_formatter_type) REFERENCES formatter_type(id),
ADD
    CONSTRAINT fk_scale_type FOREIGN KEY (scale_type) REFERENCES scale_type(id);