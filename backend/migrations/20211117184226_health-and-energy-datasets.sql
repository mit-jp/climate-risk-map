-- Add missing data sources: NASA, CDC, EIA, SEDAC, USFWS, HUD
INSERT INTO
    data_source (name, description, link)
VALUES
    (
        'NASA Earth Data',
        'We downloaded data for annual 2015. To obtain population weighted PM2.5, we also used the following data: Land Area Data: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-land-water-area-rev11/data-download Population Density for 2015: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density-adjusted-to-2015-unwpp-country-totals-rev11',
        'https://beta.sedac.ciesin.columbia.edu/data/set/aqdh-pm2-5-concentrations-contiguous-us-1-km-2000-2016'
    ),
    (
        'Centers for Disease Control and Prevention',
        'The agency''s main goal to be the protection of public health and safety through the control and prevention of disease, injury, and disability in the US and worldwide.',
        'https://www.cdc.gov/nchs/nvss/deaths.htm'
    ),
    (
        'U.S. Energy Information Administration',
        'The State Energy Data System (SEDS) is the source of the U.S. Energy Information Administration''s (EIA) comprehensive state energy statistics. EIA''s goal in maintaining SEDS is to create historical time series of energy production, consumption, prices, and expenditures by state that are defined as consistently as possible over time and across sectors for analysis and forecasting purposes.',
        'https://www.eia.gov/state/seds/'
    ),
    (
        'NASA Socioeconomic Data and Applications Center',
        'A Data Center in NASA''s Earth Observing System Data and Information System',
        'https://sedac.ciesin.columbia.edu/data/sets/browse'
    ),
    (
        'U.S. Fish and Wildlife Service',
        'The U.S. Fish and Wildlife Service is the premier government agency dedicated to the conservation, protection, and enhancement of fish, wildlife and plants, and their habitats.',
        'https://ecos.fws.gov/ecp/report/critical-habitat'
    ),
    (
        'U.S. Department of Housing and Urban Development',
        'The U.S. Department of Housing and Urban Development''s Office of Policy Development and Research (PD&R) supports the Department''s efforts to help create cohesive, economically healthy communities. PD&R is responsible for maintaining current information on housing needs, market conditions, and existing programs, as well as conducting research on priority housing and community development issues. The Office provides reliable and objective data and analysis to help inform policy decisions. PD&R is committed to involving a greater diversity of perspectives, methods, and researchers in HUD research.',
        'https://www.huduser.gov/portal/datasets/ahar/2020-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html'
    );

-- Expand length of units and short_name
ALTER TABLE
    dataset
ALTER COLUMN
    units TYPE VARCHAR(255),
ALTER COLUMN
    short_name TYPE VARCHAR(255);

-- Add missing datasets
INSERT INTO
    dataset (
        short_name,
        name,
        units,
        description
    )
VALUES
    -- Health
    (
        'PM2_5',
        'Exposure to airborne particulate matter',
        'µg/m³ (population weighted average)',
        'Gridded concentrations of fine particulate matter (PM2.5) (Di et al, 2021) are combined with gridded population data (CIESIN, 2018) to provide an estimate of the annual average level of PM2.5 experienced by the population of each county in the US. Link: Di et al, 2021 (https://doi.org/10.7927/0rvr-4538) and CIESIN, 2018 (https://doi.org/10.7927/H4F47M65)'
    ),
    (
        'Deaths_0_5',
        'Deaths, ages 0 to 5',
        'deaths / year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Deaths_5_25',
        'Deaths, ages 5 to 25',
        'deaths / year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Deaths_25_plus',
        'Deaths, ages 25+',
        'deaths / year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Deaths_25_plus_circ',
        'Circulatory Deaths, ages 25+',
        'deaths / year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Deaths_25_plus_resp',
        'Respiratory Deaths, ages 25+',
        'deaths / year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_0_5',
        'Death Rate, ages 0 to 5',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_0_5_est',
        'Estimated Death Rate, ages 0 to 5',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_5_25',
        'Death Rate, ages 5 to 25',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_5_25_est',
        'Estimated Death Rate, ages 5 to 25',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_25_plus',
        'Death Rate, ages 25+',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_25_plus_est',
        'Estimated Death Rate, ages 25+',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_25_plus_circ',
        'Circulatory Death Rate, ages 25+',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_25_plus_circ_est',
        'Estimated Circulatory Death Rate, ages 25+',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_25_plus_resp',
        'Respiratory Death Rate, ages 25+',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    (
        'Mortality_25_plus_resp_est',
        'Estimated Respiratory Death Rate, ages 25+',
        'deaths per 1,000 people per year',
        'County-level, age-specific, cause-specific mortality data across the US. Deaths in counties with a small number of deaths are omitted, due to privacy constraints. We estimate death rates for such counties based on state-level averages.'
    ),
    -- Energy
    (
        'energy_expenditure_per_capita',
        'Energy Expenditure Per Capita',
        'USD per person',
        ''
    ),
    (
        'residential_energy_expenditure_per_capita',
        'Residential Energy Expenditure Per Capita',
        'USD per person',
        ''
    ),
    (
        'transportation_energy_expenditure_per_capita',
        'Transportation Energy Expenditure Per Capita',
        'USD per person',
        ''
    ),
    (
        'energy_expenditure_share_of_gdp',
        'Energy Expenditure as Share of GDP',
        '% of GDP',
        ''
    ),
    (
        'residential_energy_expenditure_share_of_gdp',
        'Residential Energy Expenditure as Share of GDP',
        '% of GDP',
        ''
    ),
    (
        'transportation_energy_expenditure_share_of_gdp',
        'Transportation Energy Expenditure as Share of GDP',
        '% of GDP',
        ''
    );