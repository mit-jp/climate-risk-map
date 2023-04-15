-- if there's no value, we simply don't insert a row. There's no point in having null rows.
DELETE FROM
    "data"
WHERE
    "value" IS NULL;

ALTER TABLE
    "data"
ALTER COLUMN
    "value"
SET
    NOT NULL;