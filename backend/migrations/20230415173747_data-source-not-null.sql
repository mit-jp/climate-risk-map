-- The description and link for a data source should always be filled in
UPDATE
    data_source
SET
    description = data_source.name
WHERE
    description = '';

UPDATE
    data_source
SET
    link = 'https://data.nhm.ac.uk/dataset/bii-bte'
WHERE
    name = 'Biodiversity Index';

UPDATE
    data_source
SET
    link = 'https://www.iucnredlist.org/assessment/red-list-index'
WHERE
    name = 'Red List Index';