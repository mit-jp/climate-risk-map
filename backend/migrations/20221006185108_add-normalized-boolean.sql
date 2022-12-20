ALTER TABLE
    data_category
ADD
    COLUMN normalized BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE
    data_category
SET
    normalized = TRUE
WHERE
    NAME = 'risk metrics';