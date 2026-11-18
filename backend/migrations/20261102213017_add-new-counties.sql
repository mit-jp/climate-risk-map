-- Add new AK census areas (split from Valdez-Cordova) and CT planning regions
INSERT INTO
    geo_id (geography_type, id, name)
VALUES
    (1, 2063, 'Chugach'),
    (1, 2066, 'Copper River'),
    (1, 9110, 'Capitol'),
    (1, 9120, 'Greater Bridgeport'),
    (1, 9130, 'Lower Connecticut River Valley'),
    (1, 9140, 'Naugatuck Valley'),
    (1, 9150, 'Northeastern Connecticut'),
    (1, 9160, 'Northwest Hills'),
    (1, 9170, 'South Central Connecticut'),
    (1, 9180, 'Southeastern Connecticut'),
    (1, 9190, 'Western Connecticut');
