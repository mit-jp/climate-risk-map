-- A default date range belongs to the default source, and needs both its dates
UPDATE
    map_visualization
SET
    default_start_date = NULL,
    default_end_date = NULL
WHERE
    default_source IS NULL
    OR default_start_date IS NULL
    OR default_end_date IS NULL;

ALTER TABLE
    map_visualization
ADD
    CONSTRAINT default_date_range_has_both_dates CHECK (
        (default_start_date IS NULL) = (default_end_date IS NULL)
    ),
ADD
    CONSTRAINT default_date_range_has_default_source CHECK (
        default_start_date IS NULL
        OR default_source IS NOT NULL
    );
