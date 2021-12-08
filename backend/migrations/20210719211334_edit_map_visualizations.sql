-- Population per square mile should not have a PDF
ALTER TABLE
    map_visualization
ADD
    COLUMN show_pdf BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE
    map_visualization
SET
    show_pdf = FALSE
WHERE
    dataset = 33;