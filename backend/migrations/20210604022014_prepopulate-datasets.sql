INSERT INTO
    dataset (
        short_name,
        name,
        description,
        units
    )
VALUES
    -- water
    (
        'water_stress',
        'Water Stress',
        'The approximate proportion of the available water that''s being used. Withdrawal (fresh surface + groundwater) / Runoff. 0.3 is slightly exploited, 0.3 to 0.6 is moderately exploited, 0.6 to 1 is heavily exploited, and > 1 is overexploited. We used runoff from the ERA climate scenario for each year, water withdrawal from the USGS (https://water.usgs.gov/watuse/data/), and aded data for surface freshwater withdrawals (TO-WSWFr) and surface freshwater withdrawals (TO-WGWFr) to determine total freshwater withdrawals. To calculate the average, we averaged the total freshwater withdrawal for 2010 and 2015, averaged the runoff for 2010 and 2015, and took the ratio of withdrawal/runoff.',
        ''
    ),
    (
        'water_quality',
        'Water Quality',
        'Lower values represent better quality and higher values represent worse quality. The EPA created the Water Quality Index from 6 data sources: the WATERS program database, Estimated Use of Water in the United States, the National Atmospheric Deposition Program, the Drought Monitor Network, the National Contaminant Occurrence Database, and the Safe Drinking Water Information System. The Water Quality Index is 1 of 5 Environmental Quality Indices by the EPA.',
        ''
    ),
    (
        'irrigation_deficit',
        'Irrigation Deficit',
        'How much additional water crops may need that isn''t supplied by rainfall alone. Difference between mean annual potential evapotransipiration and precipitation (def = pet - prc)',
        'mm/year'
    ),
    (
        'climate_moisture_index',
        'Climate Moisture Index',
        'How wet or dry an area of land is averaged over many years. Values range from -10 (very dry) to +10 (very wet). Calculated from mean annual precipitation and potential evapotransipiration',
        ''
    ),
    (
        'hydrologic_drought_indicator',
        'Hydrologic Drought Indicator',
        'The river flow among the most severely dry years (5th percentile) during the time period.',
        'mm/year'
    ),
    (
        'groundwater_recharge',
        'Groundwater recharge',
        'An estimation of the amount of precipitation that soaks into the ground (and replenishes groundwater supply). Minimum of the 12 monthly runoff climatology during the specific period (40 years or 20 years. To avoid negative values, the minimum cutoff value is set to be 0.000001)',
        'mm/month'
    ),
    (
        'evapotranspiration',
        'Mean Annual Potential Evapotranspiration',
        'The maximum amount of water that the air could evaporate. Monthly potential evapotranspiration is calculated based on monthly mean surface air temperature, monthly mean temperature diurnal range, and monthly mean precipitation using modified Hargreaves method (Droogers and Allen, Irrigation and Drainage Systems 16: 33–45, 2002)',
        'mm/year'
    ),
    (
        'precipitation',
        'Mean Annual Precipitation',
        'Directly calculated from the reanalysis data',
        'mm/year'
    ),
    (
        'runoff',
        'Mean Annual Runoff',
        'Monthly runoff is calculated based on the monthly precipitation and potential evapotransipiration using the Turc-Pike model (Yates, Climate Research, Vol 9, 147-155, 1997)',
        'mm/year'
    ),
    (
        '10_year_flood_risk',
        '10 Year Flood Risk',
        '',
        ''
    ),
    (
        '100_year_flood_risk',
        '100 Year Flood Risk',
        '',
        ''
    ),
    -- Economy
    (
        'employment_in_all_industries',
        'Employment in all industries',
        'A count of full-time and part-time jobs in U.S. counties and metropolitan areas, with industry detail. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.',
        'people'
    ),
    (
        'gdp',
        'GDP',
        'A comprehensive measure of the economies of counties, metropolitan statistical areas, and some other local areas. Gross domestic product estimates the value of the goods and services produced in an area. It can be used to compare the size and growth of county economies across the nation.',
        'USD'
    ),
    (
        'gdp_per_capita',
        'GDP Per Capita',
        'The GDP in each county divided by the number of people in that county. A comprehensive measure of the economies of counties, metropolitan statistical areas, and some other local areas. Gross domestic product estimates the value of the goods and services produced in an area. It can be used to compare the size and growth of county economies across the nation.',
        'USD per capita'
    ),
    -- Land
    (
        'erodible_cropland',
        'Highly Erodible Cropland',
        'Acres of erodible cropland in the selected year. Based off the following maps: https://www.nrcs.usda.gov/Internet/NRCS_RCA/maps/m14601hel82.png https://www.nrcs.usda.gov/Internet/NRCS_RCA/maps/m14598hel17.png. Original shapefiles of the data via from Tcheuko, Lucas - FPAC-NRCS, Beltsville, MD <Lucas.Tcheuko@usda.gov>',
        'acres'
    ),
    (
        'land_disturbance',
        'Land Disturbance',
        'Low values indicate higher quality, and higher values mean lower quality. The land domain included five data sources representing five constructs: 1) Agriculture, 2) Pesticides, 3) Facilities, 4) Radon, and 5) Mining Activity. The data are from the 2007 Census of Agriculture, 2009 National Pesticide Use Database, EPA Geospatial Data 12 Download Service, Map of Radon Zones, and Mine Safety and Health Administration. The Land Quality Index is 1 of 5 Environmental Quality Indices by the EPA.',
        ''
    ),
    (
        'insured_farm_land',
        'Insured farm land',
        'Land enrolled in crop insurance programs in U.S. farms',
        'Acres'
    ),
    (
        'cropland',
        'Cropland',
        'Total cropland in U.S. farms',
        'Acres'
    ),
    (
        'agricultural_building_value',
        'Agricultural Building Value',
        'Estimated market value of land and buildings in U.S. farms',
        'USD'
    ),
    (
        'pastureland',
        'Pastureland',
        'Pastureland in U.S. farms',
        'Acres'
    ),
    (
        'woodland',
        'Woodland',
        'Woodland in U.S. farms',
        'Acres'
    ),
    -- Climate
    (
        'maximum_month_temperature',
        'Maximum Month Temperature',
        'The hottest month out of all months in the years selected. Directly calculated from the reanalysis data',
        '°C'
    ),
    (
        'mining_quarrying_oil_and_gas',
        'Mining, Quarrying, and Oil & Gas Extraction',
        'A percentage of employed people in this specific industry. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.',
        '% of employed people'
    ),
    (
        'construction',
        'Construction',
        'A percentage of employed people in this specific industry. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.',
        '% of employed people'
    ),
    (
        'agriculture',
        'Agriculture, forestry, fishing, and hunting',
        'A percentage of employed people in this specific industry. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.',
        '% of employed people'
    ),
    (
        'healthcare',
        'Healthcare and social assistance',
        'A percentage of employed people in this specific industry. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.',
        '% of employed people'
    ),
    (
        'per_capita_personal_income',
        'Per capita personal income',
        'Income that people get from wages, proprietors'' income, dividends, interest, rents, and government benefits. A person''s income is counted in the county, metropolitan statistical area, or other area where they live, even if they work elsewhere.',
        'USD / person'
    ),
    (
        'percent_population_under_18',
        'Population Under 18',
        '',
        '% of people'
    ),
    (
        'percent_population_over_65',
        'Population Over 65',
        '',
        '% of people'
    ),
    (
        'percent_nonwhite',
        'Nonwhite Population',
        '',
        '% of people'
    ),
    (
        'population_below_poverty_level',
        'Population Below Poverty Level',
        '',
        '% of people'
    ),
    (
        'unemployment_rate',
        'Unemployment Rate',
        '',
        '% of people'
    ),
    (
        'population_density',
        'Population Density',
        '',
        'people / sq mile'
    ),
    (
        'property_count',
        'Property Count',
        '',
        'properties'
    ),
    -- Climate opinions
    (
        'discuss_global_warming',
        'Discuss global warming at least occasionally',
        '',
        '% of people'
    ),
    (
        'reduce_tax',
        'Support requiring fossil fuel companies to pay a carbon tax',
        '',
        '% of people'
    ),
    (
        'co2_limits',
        'Support setting strict CO2 limits on existing coal-fired power plants',
        '',
        '% of people'
    ),
    (
        'local_officials',
        'Agree that your local officials should do more to address global warming',
        '',
        '% of people'
    ),
    (
        'governor',
        'Agree that your governor should do more to address global warming',
        '',
        '% of people'
    ),
    (
        'congress',
        'Agree that congress should do more to address global warming',
        '',
        '% of people'
    ),
    (
        'president',
        'Agree that the president should do more to address global warming',
        '',
        '% of people'
    ),
    (
        'corporations',
        'Agree that corporations and industry should do more to address global warming',
        '',
        '% of people'
    ),
    (
        'citizens',
        'Agree that citizens themselves should do more to address global warming',
        '',
        '% of people'
    ),
    (
        'regulate',
        'Support regulating CO2 as a pollutant',
        '',
        '% of people'
    ),
    (
        'support_rps',
        ' Support requiring utilities to produce 20% electricity from renewable sources',
        '',
        '% of people'
    ),
    (
        'drill_offshore',
        'Support expanding offshore drilling for oil and natural gas off the U.S. coast',
        '',
        '% of people'
    ),
    (
        'drill_anwr',
        'Support drilling for oil in the Arctic National Wildlife Refuge',
        '',
        '% of people'
    ),
    (
        'fund_renewables',
        'Support funding research into renewable energy sources',
        '',
        '% of people'
    ),
    (
        'rebates',
        'Support providing tax rebates',
        '',
        '% of people'
    ),
    (
        'media_weekly',
        'Hear about global warming in the media at least once a week',
        '',
        '% of people'
    ),
    (
        'pri_env',
        'Agree that global warming should be a high priority for the next president and Congress',
        '',
        '% of people'
    ),
    (
        'teach_gw',
        'Agree that schools should teach about global warming',
        '',
        '% of people'
    ),
    (
        'happening',
        'Agree that global warming is happening',
        '',
        '% of people'
    ),
    (
        'human',
        'Agree that global warming is caused mostly by human activities',
        '',
        '% of people'
    ),
    (
        'consensus',
        'Agree that most scientists think global warming is happening',
        '',
        '% of people'
    ),
    (
        'worried',
        'Are worried about global warming',
        '',
        '% of people'
    ),
    (
        'personal',
        'Think that global warming will harm me personally',
        '',
        '% of people'
    ),
    (
        'harm_us',
        'Think that global warming is already harming people in the US',
        '',
        '% of people'
    ),
    (
        'harm_dev',
        'Think that global warming will harm people in developing countries',
        '',
        '% of people'
    ),
    (
        'future_gen',
        'Think that global warming will harm future generations',
        '',
        '% of people'
    ),
    (
        'harm_plants',
        'Think that global warming will harm plants and animals ',
        '',
        '% of people'
    ),
    (
        'timing',
        'Think a candidate’s views on global warming are important to their vote',
        '',
        '% of people'
    ),
    (
        'affect_weather',
        'Think that global warming is affecting the weather in the United States',
        '',
        '% of people'
    ),
    (
        'fossil_fuels_employment',
        'Employment in Fossil Fuels',
        '',
        '% of employed people'
    ),
    (
        'renewables_employment',
        'Employment in Renewables',
        '',
        '% of employed people'
    ),
    (
        'efficiency_employment',
        'Employment in Efficiency',
        '',
        '% of employed people'
    ),
    (
        'transmission_employment',
        'Employment in Transmission',
        '',
        '% of employed people'
    ),
    (
        'motor_vehicles_employment',
        'Employment in Motor Vehicles',
        '',
        '% of employed people'
    )