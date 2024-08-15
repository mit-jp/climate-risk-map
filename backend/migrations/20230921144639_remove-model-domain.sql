-- Remove domain from future model table, as future data already has a start and end date
ALTER TABLE
    future_model DROP COLUMN domain;