-- Add migration script here
UPDATE
    map_visualization
SET
    show_pdf = true
WHERE
    dataset = 33;