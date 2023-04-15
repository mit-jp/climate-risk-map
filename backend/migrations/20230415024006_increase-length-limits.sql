-- change all varchar fields to text so they can be longer
ALTER TABLE
    dataset
ALTER COLUMN
    name TYPE text,
ALTER COLUMN
    description TYPE text,
ALTER COLUMN
    units TYPE text,
ALTER COLUMN
    short_name TYPE text;

ALTER TABLE
    data_source
ALTER COLUMN
    name TYPE text,
ALTER COLUMN
    description TYPE text,
ALTER COLUMN
    link TYPE text;

ALTER TABLE
    data_category
ALTER COLUMN
    name TYPE text;

ALTER TABLE
    subcategory
ALTER COLUMN
    name TYPE text;