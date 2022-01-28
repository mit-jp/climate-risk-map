-- Add missing data sources: NASA, CDC, EIA, SEDAC, USFWS, HUD
INSERT INTO
    data_source (name, description, link)
VALUES
    (
        'Global Biodiversity Information Facility',
        'An international network and data infrastructure funded by the world''s governments and aimed at providing anyone, anywhere, open access to data about all types of life on Earth.',
        'https://www.gbif.org/occurrence/search?basis_of_record=HUMAN_OBSERVATION&country=US&dataset_key=7fd12114-9010-4c13-8f46-990fe04ca882&iucn_red_list_category=EN&iucn_red_list_category=CR'
    );