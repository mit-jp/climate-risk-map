UPDATE
    dataset
SET
    description = 'Wildfire Risk to Communities is designed to help community leaders such as elected officials, community planners, and fire managers understand how risk varies across a state, region, or county and prioritize actions to mitigate risk. This is the first time that maps and data about community wildfire risk are available nationwide. As a national project, Wildfire Risk to Communities is best for comparing risk among rather than within communities, and it is not designed for considering risk at the local, neighborhood, or individual home scale.'
WHERE
    id = 95;

UPDATE
    data_source
SET
    "description" = 'An international network and data infrastructure funded by the world''s governments and aimed at providing anyone, anywhere, open access to data about all types of life on Earth. GBIF.org (03 January 2022) GBIF Occurrence Download',
    "link" = 'https://doi.org/10.15468/dl.gew2z6'
WHERE
    id = 18;