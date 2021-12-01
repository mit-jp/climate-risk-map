UPDATE
    dataset
SET
    name = 'Aggregate Flood Risk',
    description = 'The risk metric is from the First Street Foundation’s county-level flood risk factor. The county’s value is based on the average value across all land parcels that have a flood risk factor value between 2 and 10 (i.e. any value lower than 2 is not included). The flood risk factor value takes into account the expected depth of the flood event and the corresponding frequency of that event.'
WHERE
    id = 10;