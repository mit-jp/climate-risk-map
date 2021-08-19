import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format, scaleDivergingSymlog, scaleSequentialSqrt } from 'd3';
import { Set, OrderedMap } from 'immutable';
import { ColorScheme } from './Home';
import chroma from 'chroma-js';

export enum MapType {
    Bubble,
    Choropleth,
}

export enum DataType {
    Climate = "climate",
    Water = "water",
    Land = "land",
    Economic = "economic",
    Demographics = "demographics",
    Health = "health",
    ClimateOpinions = "climate opinions",
    Energy = "energy",
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
    WaterStress = "WS_ERA",
    WS_EQI = "WS_EQI",
    AllIndustries = "AllIndustries",
    MiningQuarryingAndOilAndGasExtraction = "MiningQuarryingAndOilAndGasExtraction",
    Construction = "Construction",
    AgricultureForestryFishingAndHunting = "AgricultureForestryFishingAndHunting",
    HealthcareAndSocialAssistance = "HealthCareAndSocialAssistance",
    PerCapitapersonalincome2018 = "PerCapitapersonalincome2018",
    GDP2018 = "GDP2018",
    GDP2018PerCapita = "GDP2018PC",
    PercentPopulationUnder18 = "PercentPopulationUnder18",
    PercentPopulationOver65 = "PercentPopulationOver65",
    PercentNonwhite = "PercentNonwhite",
    PercentofPopulationBelowPovertyLevel = "PercentofPopulationBelowPovertyLevel",
    UnemploymentRate = "UnemploymentRate",
    Populationpersquaremile2010 = "Populationpersquaremile2010",
    discuss = "discuss",
    reducetax = "reducetax",
    CO2limits = "CO2limits",
    localofficials = "localofficials",
    governor = "governor",
    congress = "congress",
    president = "president",
    corporations = "corporations",
    citizens = "citizens",
    regulate = "regulate",
    supportRPS = "supportRPS",
    drilloffshore = "drilloffshore",
    drillANWR = "drillANWR",
    fundrenewables = "fundrenewables",
    rebates = "rebates",
    mediaweekly = "mediaweekly",
    prienv = "prienv",
    teachGW = "teachGW",
    happening = "happening",
    human = "human",
    consensus = "consensus",
    worried = "worried",
    personal = "personal",
    harmUS = "harmUS",
    devharm = "devharm",
    futuregen = "futuregen",
    harmplants = "harmplants",
    timing = "timing",
    affectweather = "affectweather",
    ErodibleCropland = "ErodCrop",
    FloodRisk10Years = "avg_risk_score_2_10",
    FloodRisk100Years = "avg_risk_fsf_2020_100",
    PropertyCount = "count_property",
    Land_EQI = "Land_EQI",
    CropInsurance = "AGLANDCROPINSURANCEACRES",
    Cropland = "AGLANDCROPLANDACRES",
    AgriculturalBuildingValue = "AGLANDINCLBUILDINGSASSETVALUEMEASUREDIN",
    PastureLand = "AGLANDPASTURELANDACRES",
    Woodland = "AGLANDWOODLANDACRES",
    RenewablesEmployment = "RenewablesEmploymentPCTEmp",
    FossilFuelsEmployment = "FossilEmploymentPCTEmp",
    EfficiencyEmployment = "EfficiencyEmploymentPCTEmp",
    TransmissionEmployment = "TransmissionEmploymentPCTEmp",
    MotorVehiclesEmployment = "MotorVehiclesEmploymentPCTEmp",
    PM2_5 = "PM2_5",
    Deaths_0_5 = "deaths_0-5",
    Deaths_25_plus = "deaths_25+",
    Deaths_5_25 = "deaths_5-25",
    Deaths_0_5_circ = "deaths_0-5_circ",
    Deaths_25_plus_circ = "deaths_25+_circ",
    Deaths_5_25_circ = "deaths_5-25_circ",
    Deaths_0_5_resp = "deaths_0-5_resp",
    Deaths_25_plus_resp = "deaths_25+_resp",
    Deaths_5_25_resp = "deaths_5-25_resp",
    Population_0_5 = "Population_0-5",
    Population_5_25 = "Population_5-25",
    Population_25_plus = "Population_25+",
}

export type DataIdParams = {
    year?: Year,
    dataset?: Dataset,
    normalization: Normalization,
    dataGroup: DataGroup,
};

export type DataDefinition = {
    name: (normalization: Normalization) => string,
    id: (params: DataIdParams) => string
    units: string,
    formatter: (n: number | { valueOf(): number }) => string,
    legendFormatter: (n: number | { valueOf(): number }) => string,
    legendTicks?: number,
    color: ColorScheme,
    normalizations: Set<Normalization>,
    type: DataType,
    description: (normalization: Normalization) => string,
    years: Year[],
    datasets: Dataset[],
    mapType: MapType,
}

export enum Normalization {
    Raw,
    Percentile,
}

const employmentDescription = () => "A percentage of employed people in this specific industry. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.";

export const getUnits = (dataDefinition: DataDefinition, normalization: Normalization) => {
    let units = "";
    if (normalization === Normalization.Raw) {
        units = dataDefinition.units;
    } else {
        units = "Normalized Value";
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
    Census = "census",
    USDA = "usda",
    EQI = "EPA",
    FirstStreet = "first street",
    NASS = "National Agricultural Statistics Service",
    USEER = "US Energy and Employment Report",
    NASA = "NASA Earth Data",
    CDC = "Centers for Disease Control and Prevention",
}

export type DatasetDefinition = {
    name: string,
    description: string,
    link: string
}

export enum Year {
    _1982 = "82",
    _1980_1999 = "80_99",
    _2000_2019 = "00_19",
    _1980_2019 = "80_19",
    _2017 = "17",
    _2015 = "2015",
    _2010 = "2010",
    _2005 = "2005",
    _2000 = "2000",
    _1995 = "1995",
    Average = "_Avg",
}

export const riskMetricFormatter = (d: number | { valueOf(): number; }) => format(".0%")(d).slice(0, -1)
export const regularNumber = format(",.0f");
const money = format("$,.2s");
const nearestSI = format("~s");
const years = [Year._1980_1999, Year._2000_2019, Year._1980_2019];
const climateDatasets = [Dataset.ERA5, Dataset.MERRA2, Dataset.NARR];
const getClimateDataId = (params: DataIdParams) => {
    let dataId: string = params.dataGroup as string;
    dataId = params.dataset + dataId + "_" + params.year;
    return dataId;
};
const getRegularId = (params: DataIdParams) => params.dataGroup as string

// Externally-visible signature
function throwBadDataset(dataset: never): never;
// Implementation signature
function throwBadDataset(dataset: Dataset) {
    throw new Error('Unknown dataset: ' + dataset);
}
export const datasetDefinitions = (dataset: Dataset): DatasetDefinition => {
    switch (dataset) {
        case Dataset.MERRA2: return {
            name: "MERRA-2",
            description: `The Modern-Era Retrospective analysis for Research
                and Applications, Version 2 (MERRA-2) provides data beginning in
                1980 at a spatial resolution of 0.625° × 0.5°. In comparison
                with the original MERRA dataset, MERRA-2 represents the advances
                made in both the Goddard Earth Observing System Model, Version
                5 (GEOS- 5) and the Global Statistical Interpolation (GSI)
                assimilation system that enable assimilation of modern hyperspectral
                radiance and microwave observations, along with GPS-Radio
                Occultation datasets. MERRA-2 is the first long-term global
                reanalysis to assimilate space- based observations of aerosols
                and represent their interactions with other physical processes
                in the climate system.`,
            link: "https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/"
        };
        case Dataset.ERA5: return {
            name: "ERA5",
            description: `ERA5 is the fifth generation of ECMWF atmospheric
                reanalyses and provides hourly estimates of a large number of
                global atmospheric, land and oceanic climate variables from 1979
                to present. The data cover the Earth on a 30km grid (0.25º of
                the operational model) and resolve the atmosphere using 137
                levels from the surface up to a height of 80km, with
                additional information about uncertainties for all variables
                at reduced spatial and temporal resolutions. ERA5 combines
                vast amounts of historical observations into global estimates
                using advanced modelling (CY41r2 of ECMWF's Integrated Forecast
                System) and data assimilation (ten member 4D-Var ensemble)
                systems. Improvements to ERA5, compared to ERA-Interim, include
                use of HadISST.2, reprocessed ECMWF climate data records (CDR),
                and implementation of RTTOV11 radiative transfer. Variational
                bias corrections have not only been applied to satellite radiances,
                but also ozone retrievals, aircraft observations, surface pressure,
                and radiosonde profiles.`,
            link: "https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5"
        };
        case Dataset.NARR: return {
            name: "NARR",
            description: `The NCEP North American Regional Reanalysis (NARR) is
                a high-resolution (32 km) data set focused upon the North American
                domain and spanning from 1979 to near present. The NARR uses the high
                resolution NCEP Eta Model (32km/45 layer) together with the Regional
                Data Assimilation System (RDAS) which directly assimilates observed
                precipitation along with other variables. Relative to the NCEP-DOE
                Global Reanalysis 2, it has a much improved land-hydrology, diurnal
                cycle and land-atmosphere interaction.`,
            link: "https://psl.noaa.gov/data/gridded/data.narr.html"
        };
        case Dataset.Yale: return {
            name: "Yale Program on Climate Change Communication",
            description: `Statistical estimates of U.S. climate change beliefs,
                risk perceptions, and policy preferences at the state and local levels.`,
            link: "https://climatecommunication.yale.edu/visualizations-data/ycom-us/"
        };
        case Dataset.BEA: return {
            name: "US Bureau of Economic Analysis",
            description: `The Bureau of Economic Analysis provides official macroeconomic
                and industry statistics, most notably reports about the gross domestic
                product of the United States and its various units—states,
                cities/towns/townships/villages/counties and metropolitan areas.`,
            link: "https://www.bea.gov/data/"
        };
        case Dataset.Census: return {
            name: "US Census Bureau",
            description: `The Census Bureau is responsible for producing data about
                the American people and economy. It continually conducts over 130 surveys
                and programs a year, including the American Community Survey, the U.S.
                Economic Census, and the Current Population Survey.`,
            link: "https://www.census.gov/data.html"
        };
        case Dataset.USDA: return {
            name: "US Department of Agriculture",
            description: `The USDA provides leadership on food, agriculture, natural resources,
                rural development,and nutrition. They publish data on cropland and farming
                as they relate to climate change.`,
            link: "https://www.usda.gov/topics/data"
        }
        case Dataset.FirstStreet: return {
            name: "First Street Flood Lab",
            description: `The First Street Foundation Flood Lab is a collection of 110
                leading academic and industry research partners working to derive
                new insights and further understanding of flood risk, its consequences,
                and possible solutions.`,
            link: "https://registry.opendata.aws/fsf-flood-risk/"
        }
        case Dataset.EQI: return {
            name: "Environmental Quality Index",
            description: `The Environmental Protection Agency's Environmental Quality Index presents data in five domains:
                air, water, land, built, and sociodemographic environments to provide
                a county-by-county snapshot of overall environmental quality
                across the entire U.S. The EQI helps researchers better understand
                how health outcomes relate to cumulative environmental exposures
                that typically are viewed in isolation.
                Data Downloaded from https://edg.epa.gov/EPADataCommons/public/ORD/CPHEA/EQI_2006_2010/`,
            link: "https://www.epa.gov/healthresearch/environmental-quality-index-eqi#overview"
        }
        case Dataset.NASS: return {
            name: "USDA National Agricultural Statistics Service",
            description: `The USDA's National Agricultural Statistics Service conducts hundreds of surveys every
                            year and prepares reports covering virtually every aspect of U.S. agriculture.`,
            link: "https://www.nass.usda.gov/",
        }
        case Dataset.USEER: return {
            name: "US Energy and Employment Report",
            description: `The 2020 U.S. Energy & Employment Report by the National Association of State Energy Officials,
                the Energy Futures Initiative, and the BW Research Partnership, includes
                job data for electric power generation, transmission, distribution & storage,
                fuels, energy efficiency, and motor vehicles.`,
            link: "https://www.usenergyjobs.org/",
        }
        case Dataset.NASA: return {
            name: "NASA Earth Data",
            description: `We downloaded data for annual 2015.
            To obtain population weighted PM2.5, we also used the following data:
            Land Area Data: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-land-water-area-rev11/data-download
            Population Density for 2015: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density-adjusted-to-2015-unwpp-country-totals-rev11`,
            link: "https://beta.sedac.ciesin.columbia.edu/data/set/aqdh-pm2-5-concentrations-contiguous-us-1-km-2000-2016"
        }
        case Dataset.CDC: return {
            name: "Centers for Disease Control and Prevention",
            description: `The agency's main goal to be the protection of public health and safety
            through the control and prevention of disease, injury, and disability in the US and worldwide.`,
            link: "https://www.cdc.gov/nchs/nvss/deaths.htm",
        }
        default: throwBadDataset(dataset);
    }
}

type DataDefinitionBuilder = {
    name: (normalization: Normalization) => string,
    id?: (params: DataIdParams) => string,
    units?: string,
    formatter?: (n: number | { valueOf(): number }) => string,
    legendFormatter?: (n: number | { valueOf(): number }) => string,
    legendTicks?: number,
    color: ColorScheme,
    normalizations?: Set<Normalization>,
    type: DataType,
    description: (normalization: Normalization) => string,
    dataset: Dataset,
    years?: Year[],
    mapType?: MapType,
}

type ClimateDataDefinitionBuilder = {
    name: (normalization: Normalization) => string,
    units?: string,
    formatter?: (n: number | { valueOf(): number }) => string,
    legendFormatter?: (n: number | { valueOf(): number }) => string,
    legendTicks?: number,
    color: ColorScheme,
    normalizations?: Set<Normalization>,
    type?: DataType,
    description: (normalization: Normalization) => string,
}

type DemographicDefinitionBuilder = {
    name: (normalization: Normalization) => string,
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
    id = getRegularId,
    units = "",
    formatter = regularNumber,
    legendFormatter = regularNumber,
    color,
    normalizations = raw,
    type,
    description,
    dataset,
    years = [],
    mapType = MapType.Choropleth,
}: DataDefinitionBuilder): DataDefinition => ({
    name,
    id,
    units,
    formatter,
    legendFormatter,
    color,
    normalizations,
    type,
    description,
    years,
    datasets: [dataset],
    mapType,
});

const surveyDefinition = (name: string): DataDefinition => genericDefinition({
    name: () => name,
    units: "% of people",
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    type: DataType.ClimateOpinions,
    description: () => "",
    dataset: Dataset.Yale,
    mapType: MapType.Choropleth,
});

const employmentDefinition = ({
    name,
    color = scaleSequential<string>(scales.interpolateGreens).domain([0, 50])
}: { name: string, color?: ColorScheme }): DataDefinition => genericDefinition({
    name: () => name,
    units: "% of employed people",
    color,
    type: DataType.Economic,
    description: employmentDescription,
    dataset: Dataset.Census,
});

const demographicDefinition = (builder: DemographicDefinitionBuilder): DataDefinition => genericDefinition({
    name: builder.name,
    units: "% of people",
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, builder.domainMax ?? 50]),
    type: DataType.Demographics,
    description: () => "",
    dataset: Dataset.Census,
    normalizations: allNormalizations,
});

const dataDefinitions = OrderedMap<DataGroup, DataDefinition>([
    [DataGroup.WaterStress, genericDefinition({
        name: () => "Water Stress",
        id: params => (params.dataGroup as string) + params.year,
        color: scaleSequentialSqrt([0, 2], scales.interpolateYlOrRd),
        formatter: format(",.1f"),
        legendFormatter: format(",.1f"),
        type: DataType.Water,
        normalizations: allNormalizations,
        description: () => `The approximate proportion of the available water that's
            being used. Withdrawal (fresh surface + groundwater) / Runoff. 0.3 is
            slightly exploited, 0.3 to 0.6 is moderately exploited, 0.6 to 1
            is heavily exploited, and > 1 is overexploited. We used runoff from
            the ERA climate scenario for each year, water withdrawal from the USGS
            (https://water.usgs.gov/watuse/data/), and aded data for surface
            freshwater withdrawals (TO-WSWFr) and surface freshwater withdrawals
            (TO-WGWFr) to determine total freshwater withdrawals.
            
            To calculate the average, we averaged the total freshwater withdrawal for 2010 and 2015,
            averaged the runoff for 2010 and 2015, and took the ratio of withdrawal/runoff.`,
        dataset: Dataset.ERA5,
        years: [Year._1995, Year._2000, Year._2005, Year._2010, Year._2015, Year.Average],
    })],
    [DataGroup.WS_EQI, genericDefinition({
        name: () => "Water Quality",
        color: scaleSequential([-2, 2], scales.interpolateYlOrRd),
        formatter: format(",.1f"),
        legendFormatter: format(",.1f"),
        type: DataType.Water,
        normalizations: allNormalizations,
        description: () => `Lower values represent better quality and higher values represent worse quality.
            The EPA created the Water Quality Index from 6 data sources:
            the WATERS program database, Estimated Use of Water in the
            United States, the National Atmospheric Deposition Program,
            the Drought Monitor Network, the National Contaminant
            Occurrence Database, and the Safe Drinking Water Information System.
            The Water Quality Index is 1 of 5 Environmental Quality Indices by the EPA.`,
        dataset: Dataset.EQI,
    })],
    [DataGroup.IrrigationDeficit, climateDefinition({
        name: () => "Irrigation Deficit",
        units: "mm/year",
        legendFormatter: nearestSI,
        color: scaleDiverging<string>(x => scales.interpolateBrBG(1 - x)).domain([-600, 0, 1600]),
        type: DataType.Water,
        description: () => "How much additional water crops may need that isn't supplied by rainfall alone. Difference between mean annual potential evapotransipiration and precipitation (def = pet - prc)",
    })],
    [DataGroup.ClimateMoistureIndex, climateDefinition({
        name: () => "Climate Moisture Index",
        units: "",
        color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
        type: DataType.Water,
        description: () => "How wet or dry an area of land is averaged over many years. Values range from -10 (very dry) to +10 (very wet). Calculated from mean annual precipitation and potential evapotransipiration",
    })],
    [DataGroup.DroughtIndicator, climateDefinition({
        name: () => "Hydrologic Drought Indicator",
        units: "mm/year",
        legendFormatter: nearestSI,
        legendTicks: 4,
        color: scaleDivergingSymlog<string>(scales.interpolateBrBG).domain([0, 250, 1500]),
        type: DataType.Water,
        description: () => "The river flow among the most severely dry years (5th percentile) during the time period.",
    })],
    [DataGroup.Groundwater, climateDefinition({
        name: () => "Groundwater recharge",
        units: "mm/month",
        color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 2, 40]),
        formatter: format(",.1f"),
        type: DataType.Water,
        description: () => "An estimation of the amount of precipitation that soaks into the ground (and replenishes groundwater supply). Minimum of the 12 monthly runoff climatology during the specific period (40 years or 20 years. To avoid negative values, the minimum cutoff value is set to be 0.000001)",
    })],
    [DataGroup.Evapotranspiration, climateDefinition({
        name: () => "Mean Annual Potential Evapotranspiration",
        units: "mm/year",
        legendFormatter: nearestSI,
        color: scaleSequential<string>(scales.interpolateYlOrRd).domain([600, 1600]),
        type: DataType.Water,
        description: () => "The maximum amount of water that the air could evaporate. Monthly potential evapotranspiration is calculated based on monthly mean surface air temperature, monthly mean temperature diurnal range, and monthly mean precipitation using modified Hargreaves method (Droogers and Allen, Irrigation and Drainage Systems 16: 33–45, 2002)",
    })],
    [DataGroup.Precipitation, climateDefinition({
        name: () => "Mean Annual Precipitation",
        units: "mm/year",
        legendFormatter: nearestSI,
        color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
        type: DataType.Water,
        description: () => "Directly calculated from the reanalysis data",
    })],
    [DataGroup.Runoff, climateDefinition({
        name: () => "Mean Annual Runoff",
        units: "mm/year",
        color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
        type: DataType.Water,
        description: () => "Monthly runoff is calculated based on the monthly precipitation and potential evapotransipiration using the Turc-Pike model (Yates, Climate Research, Vol 9, 147-155, 1997)",
    })],
    [DataGroup.FloodRisk10Years, genericDefinition({
        name: normalization => normalization === Normalization.Raw ? "10 Year Flood Risk" : "Flood risk",
        color: scaleSequential(scales.interpolateBlues).domain([4, 9]),
        type: DataType.Water,
        description: () => "",
        dataset: Dataset.FirstStreet,
        normalizations: allNormalizations,
    })],
    [DataGroup.FloodRisk100Years, genericDefinition({
        name: () => "100 Year Flood Risk",
        color: scaleSequential(scales.interpolateBlues).domain([4, 9]),
        type: DataType.Water,
        description: () => "",
        dataset: Dataset.FirstStreet,
    })],
    [DataGroup.AllIndustries, genericDefinition({
        name: () => "Employment in all industries 2019",
        units: "people",
        color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000]),
        type: DataType.Economic,
        description: () => "A count of full-time and part-time jobs in U.S. counties and metropolitan areas, with industry detail. Nonmetropolitan areas and rural counties are also included. These statistics cover wage and salary jobs and self-employment.",
        dataset: Dataset.Census,
        mapType: MapType.Bubble,
    })],
    [DataGroup.GDP2018, genericDefinition({
        name: () => "GDP 2018",
        units: "USD",
        formatter: money,
        color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8]),
        type: DataType.Economic,
        description: () => "A comprehensive measure of the economies of counties, metropolitan statistical areas, and some other local areas. Gross domestic product estimates the value of the goods and services produced in an area. It can be used to compare the size and growth of county economies across the nation.",
        dataset: Dataset.BEA,
        mapType: MapType.Bubble,
    })],
    [DataGroup.GDP2018PerCapita, genericDefinition({
        name: () => "GDP 2018 Per Capita",
        units: "USD per capita",
        formatter: money,
        legendFormatter: money,
        color: scaleSequential([10_000, 100_000], scales.interpolateGreens),
        type: DataType.Economic,
        description: () => "The GDP in each county divided by the number of people in that county. A comprehensive measure of the economies of counties, metropolitan statistical areas, and some other local areas. Gross domestic product estimates the value of the goods and services produced in an area. It can be used to compare the size and growth of county economies across the nation.",
        dataset: Dataset.BEA,
    })],
    [DataGroup.ErodibleCropland, genericDefinition({
        name: () => "Highly Erodible Cropland",
        id: ({ dataGroup, year }) => dataGroup + year,
        units: "acres",
        formatter: value => format("~s")(value.valueOf() * 10_000),
        legendFormatter: value => format("~s")(value.valueOf() * 10_000),
        color: scaleSequential<string>(chroma.scale(chroma.brewer.RdYlBu.reverse()).out("hex")).domain([0, 25]),
        type: DataType.Land,
        years: [Year._1982, Year._2017],
        description: () => `Acres of erodible cropland in the selected year.
        Based off the following maps:
        https://www.nrcs.usda.gov/Internet/NRCS_RCA/maps/m14601hel82.png
        https://www.nrcs.usda.gov/Internet/NRCS_RCA/maps/m14598hel17.png.
        Original shapefiles of the data via from 
        Tcheuko, Lucas - FPAC-NRCS, Beltsville, MD <Lucas.Tcheuko@usda.gov>`,
        dataset: Dataset.USDA,
        normalizations: allNormalizations,
    })],
    [DataGroup.Land_EQI, genericDefinition({
        name: () => "Land Disturbance",
        color: scaleSequential([-2, 2], scales.interpolateYlOrRd),
        formatter: format(",.1f"),
        legendFormatter: format(",.1f"),
        type: DataType.Land,
        description: () => `Low values indicate higher quality, and higher values mean lower quality.
            The land domain included five data sources representing five constructs:
            1) Agriculture, 2) Pesticides, 3) Facilities, 4) Radon, and 5) Mining Activity.
            The data are from the 2007 Census of Agriculture, 2009 National Pesticide Use Database,
            EPA Geospatial Data 12 Download Service, Map of Radon Zones,
            and Mine Safety and Health Administration.
            The Land Quality Index is 1 of 5 Environmental Quality Indices by the EPA.`,
        dataset: Dataset.EQI,
        normalizations: allNormalizations,
    })],
    [DataGroup.CropInsurance, genericDefinition({
        name: () => "Insured farm land",
        color: scaleSequential(scales.interpolateGreens),
        mapType: MapType.Bubble,
        type: DataType.Land,
        description: () => `Land enrolled in crop insurance programs in U.S. farms`,
        units: "Acres",
        dataset: Dataset.NASS,
    })],
    [DataGroup.Cropland, genericDefinition({
        name: () => "Cropland",
        color: scaleSequential(scales.interpolateGreens),
        mapType: MapType.Bubble,
        type: DataType.Land,
        description: () => `Total cropland in U.S. farms`,
        units: "Acres",
        dataset: Dataset.NASS,
    })],
    [DataGroup.AgriculturalBuildingValue, genericDefinition({
        name: () => "Agricultural Building Value",
        color: scaleSequential(scales.interpolateGreens),
        mapType: MapType.Bubble,
        type: DataType.Land,
        description: () => `Estimated market value of land and buildings in U.S. farms`,
        formatter: money,
        legendFormatter: money,
        units: "USD",
        dataset: Dataset.NASS,
    })],
    [DataGroup.PastureLand, genericDefinition({
        name: () => "Pastureland",
        color: scaleSequential(scales.interpolateGreens),
        mapType: MapType.Bubble,
        type: DataType.Land,
        description: () => `Pastureland in U.S. farms`,
        units: "Acres",
        dataset: Dataset.NASS,
    })],
    [DataGroup.Woodland, genericDefinition({
        name: () => "Woodland",
        color: scaleSequential(scales.interpolateGreens),
        mapType: MapType.Bubble,
        type: DataType.Land,
        description: () => `Woodland in U.S. farms`,
        units: "Acres",
        dataset: Dataset.NASS,
    })],
    [DataGroup.MaxTemperature, climateDefinition({
        name: normalization => normalization === Normalization.Raw ? "Maximum Month Temperature" : "Temperature Stress Indicator",
        units: "°C",
        color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
        normalizations: allNormalizations,
        description: () => "The hottest month out of all months in the years selected. Directly calculated from the reanalysis data",
    })],
    [DataGroup.MiningQuarryingAndOilAndGasExtraction, employmentDefinition({
        name: "Mining, Quarrying, and Oil & Gas Extraction 2019",
        color: scaleSequentialSqrt([0, 50], scales.interpolateGreens)
    })],
    [DataGroup.Construction, employmentDefinition({
        name: "Construction 2019",
        color: scaleSequential<string>(scales.interpolateGreens).domain([0, 15])
    })],
    [DataGroup.AgricultureForestryFishingAndHunting, employmentDefinition({
        name: "Agriculture, forestry, fishing, and hunting 2019",
        color: scaleSequentialSqrt<string>(scales.interpolateGreens).domain([0, 50])
    })],
    [DataGroup.HealthcareAndSocialAssistance, employmentDefinition({
        name: "Healthcare and social assistance 2019",
        color: scaleSequential<string>(scales.interpolateGreens).domain([5, 25])
    })],
    [DataGroup.PerCapitapersonalincome2018, genericDefinition({
        name: () => "Per capita personal income 2018",
        units: "USD / person",
        formatter: money,
        legendFormatter: money,
        color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000]),
        type: DataType.Economic,
        description: () => "Income that people get from wages, proprietors' income, dividends, interest, rents, and government benefits. A person's income is counted in the county, metropolitan statistical area, or other area where they live, even if they work elsewhere.",
        dataset: Dataset.BEA,
    })],
    [DataGroup.PercentPopulationUnder18, demographicDefinition({ name: () => "Population Under 18" })],
    [DataGroup.PercentPopulationOver65, demographicDefinition({ name: () => "Population Over 65" })],
    [DataGroup.PercentNonwhite, demographicDefinition({ name: () => "Nonwhite Population", domainMax: 100 })],
    [DataGroup.PercentofPopulationBelowPovertyLevel, demographicDefinition({ name: () => "Population Below Poverty Level" })],
    [DataGroup.UnemploymentRate, demographicDefinition({ name: () => "Unemployment Rate", domainMax: 20 })],
    [DataGroup.Populationpersquaremile2010, genericDefinition({
        name: () => "Population Density",
        units: "people / sq mile",
        color: scaleSequential<string>(scales.interpolatePurples).domain([0, 1000]),
        type: DataType.Demographics,
        description: () => "",
        normalizations: allNormalizations,
        dataset: Dataset.Census,
    })],
    [DataGroup.PropertyCount, genericDefinition({
        name: () => "Property Count",
        units: "properties",
        color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000]),
        type: DataType.Economic,
        description: () => "",
        dataset: Dataset.FirstStreet,
        mapType: MapType.Bubble,
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
    [DataGroup.FossilFuelsEmployment, genericDefinition({
        name: () => "Employment in Fossil Fuels",
        units: "% of employed people",
        color: scaleSequentialSqrt([0, 15], scales.interpolateGreens),
        type: DataType.Energy,
        description: () => "",
        normalizations: allNormalizations,
        dataset: Dataset.USEER,
    })],
    [DataGroup.RenewablesEmployment, genericDefinition({
        name: () => "Employment in Renewables",
        units: "% of employed people",
        color: scaleSequentialSqrt([0, 4], scales.interpolateGreens),
        type: DataType.Energy,
        description: () => "",
        dataset: Dataset.USEER,
    })],
    [DataGroup.EfficiencyEmployment, genericDefinition({
        name: () => "Employment in Efficiency",
        units: "% of employed people",
        color: scaleSequentialSqrt([0, 5], scales.interpolateGreens),
        type: DataType.Energy,
        description: () => "",
        dataset: Dataset.USEER,
    })],
    [DataGroup.TransmissionEmployment, genericDefinition({
        name: () => "Employment in Transmission",
        units: "% of employed people",
        color: scaleSequentialSqrt([0, 10], scales.interpolateGreens),
        type: DataType.Energy,
        description: () => "",
        dataset: Dataset.USEER,
    })],
    [DataGroup.MotorVehiclesEmployment, genericDefinition({
        name: () => "Employment in Motor Vehicles",
        units: "% of employed people",
        color: scaleSequentialSqrt([0, 10], scales.interpolateGreens),
        type: DataType.Energy,
        description: () => "",
        dataset: Dataset.USEER,
    })],
    [DataGroup.PM2_5, genericDefinition({
        name: () => "PM2.5",
        units: "µg/m³",
        color: scaleSequentialSqrt([4, 10], scales.interpolateYlOrBr),
        type: DataType.Health,
        description: () => "Annual PM2.5 concentration data in the U.S. at a resolution of 1 km weighted by population and summed to the county.",
        dataset: Dataset.NASA,
    })],
    [DataGroup.Deaths_0_5, genericDefinition({
        name: () => "Deaths, ages 0 to 5",
        units: "deaths",
        color: scaleSequentialSqrt([0, 10_000], scales.interpolateYlOrBr),
        type: DataType.Health,
        mapType: MapType.Bubble,
        description: () => "",
        dataset: Dataset.CDC,
    })],
    [DataGroup.Deaths_5_25, genericDefinition({
        name: () => "Deaths, ages 5 to 25",
        units: "deaths",
        color: scaleSequentialSqrt([0, 10_000], scales.interpolateYlOrBr),
        type: DataType.Health,
        mapType: MapType.Bubble,
        description: () => "",
        dataset: Dataset.CDC,
    })],
    [DataGroup.Deaths_25_plus, genericDefinition({
        name: () => "Deaths, ages 25+",
        units: "deaths",
        color: scaleSequentialSqrt([0, 10_000], scales.interpolateYlOrBr),
        type: DataType.Health,
        mapType: MapType.Bubble,
        description: () => "",
        dataset: Dataset.CDC,
    })],
    [DataGroup.Deaths_25_plus_circ, genericDefinition({
        name: () => "Circulatory Deaths, ages 25+",
        units: "deaths",
        color: scaleSequentialSqrt([0, 10_000], scales.interpolateYlOrBr),
        type: DataType.Health,
        mapType: MapType.Bubble,
        description: () => "",
        dataset: Dataset.CDC,
    })],
    [DataGroup.Deaths_25_plus_resp, genericDefinition({
        name: () => "Respiratory Deaths, ages 25+",
        units: "deaths",
        color: scaleSequentialSqrt([0, 10_000], scales.interpolateYlOrBr),
        type: DataType.Health,
        mapType: MapType.Bubble,
        description: () => "",
        dataset: Dataset.CDC,
    })],
]);
export default dataDefinitions;
