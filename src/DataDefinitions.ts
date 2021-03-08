import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format, scaleDivergingSymlog, scaleSequentialSqrt } from 'd3';
import { Set, OrderedMap, Map } from 'immutable';
import { ColorScheme } from './Home';

export enum MapType {
    Bubble,
    Choropleth,
}

export enum DataType {
    Climate = "climate",
    Water = "water",
    Economic = "economic",
    Demographics = "demographics",
    ClimateOpinions = "climate opinions",
}

export enum DataGroup {
    ClimateMoistureIndex = "cmi",
    IrrigationDeficit = "def",
    DroughtIndicator = "dry",
    Groundwater = "gw",
    MaxTemperature = "ht",
    Evapotranspiration = "pet",
    Precipitation = "prc",
    Runoff = "ro",
    FloodIndicator = "wet",
    AllIndustries = "AllindustriesE",
    Farming = "FarmingEPercentage",
    Mining = "MiningEPercentage",
    Construction = "ConstructionEPercentage",
    Agricultureforestryfishingandhunting = "AgricultureforestryfishingandhuntingEPercentage",
    Healthcareandsocialassistance = "HealthcareandsocialassistanceEPercentage",
    PerCapitapersonalincome2018 = "PerCapitapersonalincome2018",
    GDP2018 = "GDP2018",
    PercentPopulationUnder18 = "PercentPopulationUnder18",
    PercentPopulationOver65 = "PercentPopulationOver65",
    PercentNonwhite = "PercentNonwhite",
    PercentofPopulationBelowPovertyLevel = "PercentofPopulationBelowPovertyLevel",
    UnemploymentRate = "UnemploymentRate",
    Populationpersquaremile2010 = "Populationpersquaremile2010",
    discuss = "discuss",
    discussOppose = "discussOppose",
    reducetax = "reducetax",
    reducetaxOppose = "reducetaxOppose",
    CO2limits = "CO2limits",
    CO2limitsOppose = "CO2limitsOppose",
    localofficials = "localofficials",
    localofficialsOppose = "localofficialsOppose",
    governor = "governor",
    governorOppose = "governorOppose",
    congress = "congress",
    congressOppose = "congressOppose",
    president = "president",
    presidentOppose = "presidentOppose",
    corporations = "corporations",
    corporationsOppose = "corporationsOppose",
    citizens = "citizens",
    citizensOppose = "citizensOppose",
    regulate = "regulate",
    regulateOppose = "regulateOppose",
    supportRPS = "supportRPS",
    supportRPSOppose = "supportRPSOppose",
    drilloffshore = "drilloffshore",
    drilloffshoreOppose = "drilloffshoreOppose",
    drillANWR = "drillANWR",
    drillANWROppose = "drillANWROppose",
    fundrenewables = "fundrenewables",
    fundrenewablesOppose = "fundrenewablesOppose",
    rebates = "rebates",
    rebatesOppose = "rebatesOppose",
    mediaweekly = "mediaweekly",
    mediaweeklyOppose = "mediaweeklyOppose",
    prienv = "prienv",
    prienvOppose = "prienvOppose",
    teachGW = "teachGW",
    teachGWOppose = "teachGWOppose",
    happening = "happening",
    happeningOppose = "happeningOppose",
    human = "human",
    humanOppose = "humanOppose",
    consensus = "consensus",
    consensusOppose = "consensusOppose",
    worried = "worried",
    worriedOppose = "worriedOppose",
    personal = "personal",
    personalOppose = "personalOppose",
    harmUS = "harmUS",
    harmUSOppose = "harmUSOppose",
    devharm = "devharm",
    devharmOppose = "devharmOppose",
    futuregen = "futuregen",
    futuregenOppose = "futuregenOppose",
    harmplants = "harmplants",
    harmplantsOppose = "harmplantsOppose",
    timing = "timing",
    timingOppose = "timingOppose",
    affectweather = "affectweather",
    affectweatherOppose = "affectweatherOppose",
    WaterStressERA = "WaterStressERA",
}

export enum DataId {
    Ecmi_00_19,
    Ecmi_80_19,
    Ecmi_80_99,
    Edef_00_19,
    Edef_80_19,
    Edef_80_99,
    Edry_00_19,
    Edry_80_19,
    Edry_80_99,
    Egw_00_19,
    Egw_80_19,
    Egw_80_99,
    Eht_00_19,
    Eht_80_19,
    Eht_80_99,
    Epet_00_19,
    Epet_80_19,
    Epet_80_99,
    Eprc_00_19,
    Eprc_80_19,
    Eprc_80_99,
    Ero_00_19,
    Ero_80_19,
    Ero_80_99,
    Ewet_00_19,
    Ewet_80_19,
    Ewet_80_99,
    Mcmi_00_19,
    Mcmi_80_19,
    Mcmi_80_99,
    Mdef_00_19,
    Mdef_80_19,
    Mdef_80_99,
    Mdry_00_19,
    Mdry_80_19,
    Mdry_80_99,
    Mgw_00_19,
    Mgw_80_19,
    Mgw_80_99,
    Mht_00_19,
    Mht_80_19,
    Mht_80_99,
    Mpet_00_19,
    Mpet_80_19,
    Mpet_80_99,
    Mprc_00_19,
    Mprc_80_19,
    Mprc_80_99,
    Mro_00_19,
    Mro_80_19,
    Mro_80_99,
    Mwet_00_19,
    Mwet_80_19,
    Mwet_80_99,
    Ncmi_00_19,
    Ncmi_80_19,
    Ncmi_80_99,
    Ndef_00_19,
    Ndef_80_19,
    Ndef_80_99,
    Ndry_00_19,
    Ndry_80_19,
    Ndry_80_99,
    Ngw_00_19,
    Ngw_80_19,
    Ngw_80_99,
    Nht_00_19,
    Nht_80_19,
    Nht_80_99,
    Npet_00_19,
    Npet_80_19,
    Npet_80_99,
    Nprc_00_19,
    Nprc_80_19,
    Nprc_80_99,
    Nro_00_19,
    Nro_80_19,
    Nro_80_99,
    Nwet_00_19,
    Nwet_80_19,
    Nwet_80_99,
    AllindustriesE,
    FarmingEPercentage,
    MiningEPercentage,
    ConstructionEPercentage,
    AgricultureforestryfishingandhuntingEPercentage,
    HealthcareandsocialassistanceEPercentage,
    PerCapitapersonalincome2018,
    GDP2018,
    PercentPopulationUnder18,
    PercentPopulationOver65,
    PercentNonwhite,
    PercentofPopulationBelowPovertyLevel,
    UnemploymentRate,
    Populationpersquaremile2010,
    discuss,
    discussOppose,
    reducetax,
    reducetaxOppose,
    CO2limits,
    CO2limitsOppose,
    localofficials,
    localofficialsOppose,
    governor,
    governorOppose,
    congress,
    congressOppose,
    president,
    presidentOppose,
    corporations,
    corporationsOppose,
    citizens,
    citizensOppose,
    regulate,
    regulateOppose,
    supportRPS,
    supportRPSOppose,
    drilloffshore,
    drilloffshoreOppose,
    drillANWR,
    drillANWROppose,
    fundrenewables,
    fundrenewablesOppose,
    rebates,
    rebatesOppose,
    mediaweekly,
    mediaweeklyOppose,
    prienv,
    prienvOppose,
    teachGW,
    teachGWOppose,
    happening,
    happeningOppose,
    human,
    humanOppose,
    consensus,
    consensusOppose,
    worried,
    worriedOppose,
    personal,
    personalOppose,
    harmUS,
    harmUSOppose,
    devharm,
    devharmOppose,
    futuregen,
    futuregenOppose,
    harmplants,
    harmplantsOppose,
    timing,
    timingOppose,
    affectweather,
    affectweatherOppose,
    WaterStressERA,
}

export type DataIdParams = {
    year?: Year,
    dataset?: Dataset,
    normalization: Normalization,
    dataGroup: DataGroup,
};

export type DataDefinition = {
    name: string,
    id: (params: DataIdParams) => DataId
    units: string,
    formatter: (n: number | { valueOf(): number }) => string,
    legendFormatter: (n: number | { valueOf(): number }) => string,
    legendTicks?: number,
    color: ColorScheme,
    normalizations: Set<Normalization>,
    type: DataType,
    description: string,
    years: Year[],
    datasets: Dataset[],
    mapType: MapType,
}

export enum Normalization {
    Raw,
    Percentile,
}

export const percentileColorScheme = scaleDiverging<string>(scales.interpolateBrBG).domain([1, 0.5, 0]);
export const percentileFormatter = format(".0%");
const employmentDescription = "A percentage of employed people in this specific industry. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.";

export const getUnits = (dataDefinition: DataDefinition, normalization: Normalization) => {
    let units = "";
    if (normalization === Normalization.Raw) {
        units = dataDefinition.units;
    } else if (normalization === Normalization.Percentile) {
        units = "Percentile";
    }
    return units;
}
const raw = Set([Normalization.Raw]);
const allNormalizations = Set([Normalization.Raw, Normalization.Percentile]);

export enum Dataset {
    MERRA2 = "M",
    ERA5 = "E",
    NARR = "N",
    Yale = "yale",
    BEA = "bea",
    Census = "census"
}

export type DatasetDefinition = {
    name: string,
    description: string,
    link: string
}

export enum Year {
    _1980_1999 = "80_99",
    _2000_2019 = "00_19",
    _1980_2019 = "80_19"
}

const regularNumber = format(",.0f");
const money = format("$,.2s");
const nearestSI = format("~s");
const years = [Year._1980_1999, Year._2000_2019, Year._1980_2019];
const climateDatasets = [Dataset.ERA5, Dataset.MERRA2, Dataset.NARR];
const getClimateDataId = (params: DataIdParams) => {
    let dataIdString: string = params.dataGroup as string;
    dataIdString = params.dataset + dataIdString + "_" + params.year;
    return DataId[dataIdString as keyof typeof DataId];
};
const getRegularId = (params: DataIdParams) =>
    DataId[params.dataGroup as keyof typeof DataId];

export const datasetDefinitions = Map<Dataset, DatasetDefinition>([
    [Dataset.MERRA2, {
        name: "MERRA-2",
        description: "The Modern-Era Retrospective analysis for Research and Applications, Version 2 (MERRA-2) provides data beginning in 1980 at a spatial resolution of 0.625° × 0.5°. In comparison with the original MERRA dataset, MERRA-2 represents the advances made in both the Goddard Earth Observing System Model, Version 5 (GEOS- 5) and the Global Statistical Interpolation (GSI) assimilation system that enable assimilation of modern hyperspectral radiance and microwave observations, along with GPS-Radio Occultation datasets. MERRA-2 is the first long-term global reanalysis to assimilate space- based observations of aerosols and represent their interactions with other physical processes in the climate system.",
        link: "https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/"
    }],
    [Dataset.ERA5, {
        name: "ERA5",
        description: "ERA5 is the fifth generation of ECMWF atmospheric reanalyses and provides hourly estimates of a large number of global atmospheric, land and oceanic climate variables from 1979 to present. The data cover the Earth on a 30km grid (0.25º of the operational model) and resolve the atmosphere using 137 levels from the surface up to a height of 80km, with additional information about uncertainties for all variables at reduced spatial and temporal resolutions. ERA5 combines vast amounts of historical observations into global estimates using advanced modelling (CY41r2 of ECMWF's Integrated Forecast System) and data assimilation (ten member 4D-Var ensemble) systems. Improvements to ERA5, compared to ERA-Interim, include use of HadISST.2, reprocessed ECMWF climate data records (CDR), and implementation of RTTOV11 radiative transfer. Variational bias corrections have not only been applied to satellite radiances, but also ozone retrievals, aircraft observations, surface pressure, and radiosonde profiles.",
        link: "https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5"
    }],
    [Dataset.NARR, {
        name: "NARR",
        description: "The NCEP North American Regional Reanalysis (NARR) is a high-resolution (32 km) data set focused upon the North American domain and spanning from 1979 to near present. The NARR uses the high resolution NCEP Eta Model (32km/45 layer) together with the Regional Data Assimilation System (RDAS) which directly assimilates observed precipitation along with other variables. Relative to the NCEP-DOE Global Reanalysis 2, it has a much improved land-hydrology, diurnal cycle and land-atmosphere interaction.",
        link: "https://psl.noaa.gov/data/gridded/data.narr.html"
    }],
    [Dataset.Yale, {
        name: "Yale Program on Climate Change Communication",
        description: "Statistical estimates of U.S. climate change beliefs, risk perceptions, and policy preferences at the state and local levels.",
        link: "https://climatecommunication.yale.edu/visualizations-data/ycom-us/"
    }],
    [Dataset.BEA, {
        name: "US Bureau of Economic Analysis",
        description: "The Bureau of Economic Analysis provides official macroeconomic and industry statistics, most notably reports about the gross domestic product of the United States and its various units—states, cities/towns/townships/villages/counties and metropolitan areas.",
        link: "https://www.bea.gov/data/"
    }],
    [Dataset.Census, {
        name: "US Census Bureau",
        description: "The Census Bureau is responsible for producing data about the American people and economy. It continually conducts over 130 surveys and programs a year, including the American Community Survey, the U.S. Economic Census, and the Current Population Survey.",
        link: "https://www.census.gov/data.html"
    }],
]);

type DataDefinitionBuilder = {
    name: string,
    units?: string,
    formatter?: (n: number | { valueOf(): number }) => string,
    legendFormatter?: (n: number | { valueOf(): number }) => string,
    legendTicks?: number,
    color: ColorScheme,
    normalizations?: Set<Normalization>,
    type: DataType,
    description: string,
    dataset: Dataset,
    mapType?: MapType,
}

type ClimateDataDefinitionBuilder = {
    name: string,
    units?: string,
    formatter?: (n: number | { valueOf(): number }) => string,
    legendFormatter?: (n: number | { valueOf(): number }) => string,
    legendTicks?: number,
    color: ColorScheme,
    normalizations?: Set<Normalization>,
    type?: DataType,
    description: string,
}

type DemographicDefinitionBuilder = {
    name: string,
    domainMax?: number,
}

const climateDefinition = ({
    name,
    units = "",
    formatter = regularNumber,
    legendFormatter = regularNumber,
    legendTicks,
    color,
    normalizations = raw,
    type = DataType.Climate,
    description,
}: ClimateDataDefinitionBuilder): DataDefinition => ({
    name,
    id: getClimateDataId,
    units,
    formatter,
    legendFormatter,
    legendTicks,
    color,
    normalizations,
    type,
    description,
    years: years,
    datasets: climateDatasets,
    mapType: MapType.Choropleth,
});

const genericDefinition = ({
    name,
    units = "",
    formatter = regularNumber,
    legendFormatter = regularNumber,
    color,
    normalizations = raw,
    type,
    description,
    dataset,
    mapType = MapType.Choropleth,
}: DataDefinitionBuilder): DataDefinition => ({
    name,
    id: getRegularId,
    units,
    formatter,
    legendFormatter,
    color,
    normalizations,
    type,
    description,
    years: [],
    datasets: [dataset],
    mapType,
});

const surveyDefinition = (name: string): DataDefinition => genericDefinition({
    name,
    units: "% of people",
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    type: DataType.ClimateOpinions,
    description: "",
    dataset: Dataset.Yale,
    mapType: MapType.Choropleth,
});

const employmentDefinition = ({
    name,
    color = scaleSequential<string>(scales.interpolateGreens).domain([0, 50])
}: {name: string, color?: ColorScheme}): DataDefinition => genericDefinition({
    name,
    units: "% of employed people",
    color,
    type: DataType.Economic,
    description: employmentDescription,
    dataset: Dataset.BEA,
});

const demographicDefinition = (builder: DemographicDefinitionBuilder): DataDefinition => genericDefinition({
    name: builder.name,
    units: "% of people",
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, builder.domainMax ?? 50]),
    type: DataType.Demographics,
    description: "",
    dataset: Dataset.Census,
    normalizations: allNormalizations,
});

const dataDefinitions = OrderedMap<DataGroup, DataDefinition>([
    [DataGroup.WaterStressERA, genericDefinition({
        name: "Water Stress",
        color: scaleSequentialSqrt([0, 2], scales.interpolateYlOrRd),
        formatter: format(",.1f"),
        legendFormatter: format(",.1f"),
        type: DataType.Water,
        description: "The approximate proportion of the available water that's being used. Withdrawal (fresh surface + groundwater) / Runoff in 2015. 0.3 is slightly exploited, 0.3 to 0.6 is moderately exploited, 0.6 to 1 is heavily exploited, and > 1 is overexploited",
        dataset: Dataset.ERA5,
    })],
    [DataGroup.IrrigationDeficit, climateDefinition({
        name: "Irrigation Deficit",
        units: "mm/year",
        legendFormatter: nearestSI,
        color: scaleDiverging<string>(x => scales.interpolateBrBG(1 - x)).domain([-600, 0, 1600]),
        normalizations: allNormalizations,
        type: DataType.Water,
        description: "How much additional water crops may need that isn't supplied by rainfall alone. Difference between mean annual potential evapotransipiration and precipitation (def = pet - prc)",
    })],
    [DataGroup.ClimateMoistureIndex, climateDefinition({
        name: "Climate Moisture Index",
        units: "",
        color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
        type: DataType.Water,
        description: "How wet or dry an area of land is averaged over many years. Values range from -10 (very dry) to +10 (very wet). Calculated from mean annual precipitation and potential evapotransipiration",
    })],
    [DataGroup.DroughtIndicator, climateDefinition({
        name: "Hydrologic Drought Indicator",
        units: "mm/year",
        legendFormatter: nearestSI,
        legendTicks: 4,
        color: scaleDivergingSymlog<string>(scales.interpolateBrBG).domain([0, 250, 1500]),
        normalizations: allNormalizations,
        type: DataType.Water,
        description: "The river flow among the most severely dry years (5th percentile) during the time period.",
    })],
    [DataGroup.Groundwater, climateDefinition({
        name: "Groundwater recharge",
        units: "mm/month",
        color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 2, 40]),
        normalizations: allNormalizations,
        formatter: format(",.1f"),
        type: DataType.Water,
        description: "An estimation of the amount of precipitation that soaks into the ground (and replenishes groundwater supply). Minimum of the 12 monthly runoff climatology during the specific period (40 years or 20 years. To avoid negative values, the minimum cutoff value is set to be 0.000001)",
    })],
    [DataGroup.MaxTemperature, climateDefinition({
        name: "Maximum Month Temperature",
        units: "°C",
        color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
        normalizations: allNormalizations,
        description: "The hottest month out of all months in the years selected. Directly calculated from the reanalysis data",
    })],
    [DataGroup.Evapotranspiration, climateDefinition({
        name: "Mean Annual Potential Evapotranspiration",
        units: "mm/year",
        legendFormatter: nearestSI,
        color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
        type: DataType.Water,
        description: "The maximum amount of water that the air could evaporate. Monthly potential evapotranspiration is calculated based on monthly mean surface air temperature, monthly mean temperature diurnal range, and monthly mean precipitation using modified Hargreaves method (Droogers and Allen, Irrigation and Drainage Systems 16: 33–45, 2002)",
    })],
    [DataGroup.Precipitation, climateDefinition({
        name: "Mean Annual Precipitation",
        units: "mm/year",
        legendFormatter: nearestSI,
        color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
        type: DataType.Water,
        description: "Directly calculated from the reanalysis data",
    })],
    [DataGroup.Runoff, climateDefinition({
        name: "Mean Annual Runoff",
        units: "mm/year",
        color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
        type: DataType.Water,
        description: "Monthly runoff is calculated based on the monthly precipitation and potential evapotransipiration using the Turc-Pike model (Yates, Climate Research, Vol 9, 147-155, 1997)",
    })],
    [DataGroup.FloodIndicator, climateDefinition({
        name: "River Flood Indicator",
        units: "mm/month",
        color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
        normalizations: allNormalizations,
        type: DataType.Water,
        description: "The flood potential from high river levels (fluvial flooding). The river flow among the most severely wet months (98th percentile) during the time period.",
    })],
    [DataGroup.AllIndustries, genericDefinition({
        name: "Employment in all industries 2007",
        units: "people",
        color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000]),
        type: DataType.Economic,
        description: "A count of full-time and part-time jobs in U.S. counties and metropolitan areas, with industry detail. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.",
        dataset: Dataset.BEA,
        mapType: MapType.Bubble,
    })],
    [DataGroup.GDP2018, genericDefinition({
        name: "GDP 2018",
        units: "USD",
        formatter: money,
        color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8]),
        type: DataType.Economic,
        description: "A comprehensive measure of the economies of counties, metropolitan statistical areas, and some other local areas. Gross domestic product estimates the value of the goods and services produced in an area. It can be used to compare the size and growth of county economies across the nation.",
        dataset: Dataset.BEA,
        mapType: MapType.Bubble,
    })],
    [DataGroup.Farming, employmentDefinition({
        name:"Farming 2007"
    })],
    [DataGroup.Mining, employmentDefinition({
        name:"Mining 2007",
        color: scaleSequentialSqrt([0,50], scales.interpolateGreens)
    })],
    [DataGroup.Construction, employmentDefinition({
        name:"Construction 2007",
        color: scaleSequential<string>(scales.interpolateGreens).domain([0, 25])
    })],
    [DataGroup.Agricultureforestryfishingandhunting, employmentDefinition({
        name:"Agriculture, forestry, fishing, and hunting 2007",
        color: scaleSequentialSqrt<string>(scales.interpolateGreens).domain([0, 25])
    })],
    [DataGroup.Healthcareandsocialassistance, employmentDefinition({
        name:"Healthcare and social assistance 2007",
        color: scaleSequential<string>(scales.interpolateGreens).domain([0, 25])
    })],
    [DataGroup.PerCapitapersonalincome2018, genericDefinition({
        name: "Per capita personal income 2018",
        units: "USD / person",
        formatter: money,
        legendFormatter: money,
        color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000]),
        type: DataType.Economic,
        description: "Income that people get from wages, proprietors' income, dividends, interest, rents, and government benefits. A person's income is counted in the county, metropolitan statistical area, or other area where they live, even if they work elsewhere.",
        dataset: Dataset.BEA,
    })],
    [DataGroup.PercentPopulationUnder18, demographicDefinition({ name: "Population Under 18" })],
    [DataGroup.PercentPopulationOver65, demographicDefinition({ name: "Population Over 65" })],
    [DataGroup.PercentNonwhite, demographicDefinition({ name: "Nonwhite", domainMax: 100 })],
    [DataGroup.PercentofPopulationBelowPovertyLevel, demographicDefinition({ name: "Population Below Poverty Level" })],
    [DataGroup.UnemploymentRate, demographicDefinition({ name: "Unemployment Rate", domainMax: 20 })],
    [DataGroup.Populationpersquaremile2010, genericDefinition({
        name: "Population Density",
        units: "people / sq mile",
        color: scaleSequential<string>(scales.interpolatePurples).domain([0, 1000]),
        type: DataType.Demographics,
        description: "",
        dataset: Dataset.Census,
    })],
    [DataGroup.discuss, surveyDefinition("Discuss global warming at least occasionally")],
    [DataGroup.reducetax, surveyDefinition("Support requiring fossil fuel companies to pay a carbon tax")],
    [DataGroup.CO2limits, surveyDefinition("Support setting strict CO2 limits on existing coal-fired power plants")],
    [DataGroup.localofficials, surveyDefinition("Agree that your local officials should do more to address global warming")],
    [DataGroup.governor, surveyDefinition("Agree that your governor should do more to address global warming")],
    [DataGroup.congress, surveyDefinition("Agree that congress should do more to address global warming")],
    [DataGroup.president, surveyDefinition("Agree that the president should do more to address global warming")],
    [DataGroup.corporations, surveyDefinition("Agree that corporations and industry should do more to address global warming")],
    [DataGroup.citizens, surveyDefinition("Agree that citizens themselves should do more to address global warming")],
    [DataGroup.regulate, surveyDefinition("Support regulating CO2 as a pollutant")],
    [DataGroup.supportRPS, surveyDefinition(" Support requiring utilities to produce 20% electricity from renewable sources")],
    [DataGroup.drilloffshore, surveyDefinition("Support expanding offshore drilling for oil and natural gas off the U.S. coast")],
    [DataGroup.drillANWR, surveyDefinition("Support drilling for oil in the Arctic National Wildlife Refuge")],
    [DataGroup.fundrenewables, surveyDefinition("Support funding research into renewable energy sources")],
    [DataGroup.rebates, surveyDefinition("Support providing tax rebates")],
    [DataGroup.mediaweekly, surveyDefinition("Hear about global warming in the media at least once a week")],
    [DataGroup.prienv, surveyDefinition("Agree that global warming should be a high priority for the next president and Congress")],
    [DataGroup.teachGW, surveyDefinition("Agree that schools should teach about global warming")],
    [DataGroup.happening, surveyDefinition("Agree that global warming is happening")],
    [DataGroup.human, surveyDefinition("Agree that global warming is caused mostly by human activities")],
    [DataGroup.consensus, surveyDefinition("Agree that most scientists think global warming is happening")],
    [DataGroup.worried, surveyDefinition("Are worried about global warming")],
    [DataGroup.personal, surveyDefinition("Think that global warming will harm me personally")],
    [DataGroup.harmUS, surveyDefinition("Think that global warming is already harming people in the US")],
    [DataGroup.devharm, surveyDefinition("Think that global warming will harm people in developing countries")],
    [DataGroup.futuregen, surveyDefinition("Think that global warming will harm future generations")],
    [DataGroup.harmplants, surveyDefinition("Think that global warming will harm plants and animals ")],
    [DataGroup.timing, surveyDefinition("Think a candidate’s views on global warming are important to their vote")],
    [DataGroup.affectweather, surveyDefinition("Think that global warming is affecting the weather in the United States")],
]);
export default dataDefinitions;