import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format } from 'd3';
import { ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3-scale';
import { Set } from 'immutable';

export enum DataType {
    Climate = "climate",
    Economic = "economic",
    Demographic = "demographic",
    ClimateSurvey = "climate survey",
}

export enum DataGroup {
    ClimateMoistureIndex = "cmi",
    IrregationDeficit = "def",
    DroughtIndicator = "dry",
    Groundwater = "gw",
    MaxTemperature = "ht",
    Evapotranspiration = "pet",
    Precipitation = "prc",
    Runoff = "ro",
    FloodIndicator = "wet",
    AllIndustries = "Allindustries",
    Farming = "Farming",
    Mining = "Mining",
    Construction = "Construction",
    Retail = "Retailtrade",
    Information = "Information",
    Wholesale = "Wholesaletrade",
    PerCapitapersonalincome2018 = "PerCapitapersonalincome2018",
    GDP2018 = "GDP2018",
    PercentPopulationUnder18 = "PercentPopulationUnder18",
    PercentPopulationOver65 = "PercentPopulationOver65",
    PercentNonwhite = "PercentNonwhite",
    PercentofPopulationBelowPovertyLevel = "PercentofPopulationBelowPovertyLevel",
    PercentPopulationUnder18Std = "PercentPopulationUnder18Std",
    PercentPopulationOver65Std = "PercentPopulationOver65Std",
    PercentNonwhiteStd = "PercentNonwhiteStd",
    PercentofPopulationBelowPovertyLevelStd = "PercentofPopulationBelowPovertyLevelStd",
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
    Allindustries,
    Farming,
    Mining,
    Construction,
    Retailtrade,
    Information,
    Wholesaletrade,
    PerCapitapersonalincome2018,
    GDP2018,
    PercentPopulationUnder18,
    PercentPopulationOver65,
    PercentNonwhite,
    PercentofPopulationBelowPovertyLevel,
    PercentPopulationUnder18Std,
    PercentPopulationOver65Std,
    PercentNonwhiteStd,
    PercentofPopulationBelowPovertyLevelStd,
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
    color: ScaleSequential<string> | ScaleThreshold<number, string> | ScaleDiverging<string>,
    normalizations: Set<Normalization>,
    type: DataType,
    description: string,
    years: Year[],
    datasets: Dataset[]
}

export enum Normalization {
    Raw,
    StandardDeviations,
    Percentile,
}

export const standardDeviationColorScheme = scaleDiverging<string>(scales.interpolateBrBG).domain([4, 0, -4]);
export const percentileColorScheme = scaleDiverging<string>(scales.interpolateBrBG).domain([0, 0.5, 1]);


const raw = Set([Normalization.Raw]);
const rawAndStdDev = Set([Normalization.Raw, Normalization.StandardDeviations]);
const stdDev = Set([Normalization.StandardDeviations]);

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
const money = format("$,.0f");
const years = [Year._1980_1999, Year._2000_2019, Year._1980_2019];
const climateDatasets = [Dataset.ERA5, Dataset.MERRA2, Dataset.NARR];
const getClimateDataId = (params: DataIdParams) => {
    let dataIdString: string = params.dataGroup as string;
    dataIdString = params.dataset + dataIdString + "_" + params.year;
    return DataId[dataIdString as keyof typeof DataId];
};
const getEconDataId = (params: DataIdParams) => 
    DataId[params.dataGroup as keyof typeof DataId];

export const datasetDefinitions = new Map<Dataset, DatasetDefinition>();
datasetDefinitions.set(Dataset.MERRA2, {
    name: "MERRA-2",
    description: "The Modern-Era Retrospective analysis for Research and Applications, Version 2 (MERRA-2) provides data beginning in 1980 at a spatial resolution of 0.625° × 0.5°. In comparison with the original MERRA dataset, MERRA-2 represents the advances made in both the Goddard Earth Observing System Model, Version 5 (GEOS- 5) and the Global Statistical Interpolation (GSI) assimilation system that enable assimilation of modern hyperspectral radiance and microwave observations, along with GPS-Radio Occultation datasets. MERRA-2 is the first long-term global reanalysis to assimilate space- based observations of aerosols and represent their interactions with other physical processes in the climate system.",
    link: "https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/"
});
datasetDefinitions.set(Dataset.ERA5, {
    name: "ERA5",
    description: "ERA5 is the fifth generation of ECMWF atmospheric reanalyses and provides hourly estimates of a large number of global atmospheric, land and oceanic climate variables from 1979 to present. The data cover the Earth on a 30km grid (0.25º of the operational model) and resolve the atmosphere using 137 levels from the surface up to a height of 80km, with additional information about uncertainties for all variables at reduced spatial and temporal resolutions. ERA5 combines vast amounts of historical observations into global estimates using advanced modelling (CY41r2 of ECMWF's Integrated Forecast System) and data assimilation (ten member 4D-Var ensemble) systems. Improvements to ERA5, compared to ERA-Interim, include use of HadISST.2, reprocessed ECMWF climate data records (CDR), and implementation of RTTOV11 radiative transfer. Variational bias corrections have not only been applied to satellite radiances, but also ozone retrievals, aircraft observations, surface pressure, and radiosonde profiles.",
    link: "https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5"
});
datasetDefinitions.set(Dataset.NARR, {
    name: "NARR",
    description: "The NCEP North American Regional Reanalysis (NARR) is a high-resolution (32 km) data set focused upon the North American domain and spanning from 1979 to near present. The NARR uses the high resolution NCEP Eta Model (32km/45 layer) together with the Regional Data Assimilation System (RDAS) which directly assimilates observed precipitation along with other variables. Relative to the NCEP-DOE Global Reanalysis 2, it has a much improved land-hydrology, diurnal cycle and land-atmosphere interaction.",
    link: "https://psl.noaa.gov/data/gridded/data.narr.html"
});
datasetDefinitions.set(Dataset.Yale, {
    name: "Yale Climate Opinion Maps",
    description: "Climate surveys done in 2020",
    link: "https://climatecommunication.yale.edu/visualizations-data/ycom-us/"
});
datasetDefinitions.set(Dataset.BEA, {
    name: "US Bureau of Economic Analysis",
    description: "The Bureau of Economic Analysis provides official macroeconomic and industry statistics, most notably reports about the gross domestic product of the United States and its various units—states, cities/towns/townships/villages/counties and metropolitan areas.",
    link: "https://www.bea.gov/data/"
});
datasetDefinitions.set(Dataset.Census, {
    name: "US Census Bureau",
    description: "The Census Bureau is responsible for producing data about the American people and economy. It continually conducts over 130 surveys and programs a year, including the American Community Survey, the U.S. Economic Census, and the Current Population Survey.",
    link: "https://www.census.gov/data.html"
});

const dataDefinitions = new Map<DataGroup, DataDefinition>();
dataDefinitions.set(DataGroup.ClimateMoistureIndex, {
    name:"Climate Dryness Index",
    id: getClimateDataId,
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([10, 0, -10]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Calculated from mean annual precipitation and potential evapotransipiration",
    years: [Year._2000_2019],
    datasets: [Dataset.ERA5]
});
dataDefinitions.set(DataGroup.IrregationDeficit, {
    name:"Irrigation Deficit",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Difference between mean annual potential evapotransipiration and precipitation (def = pet - prc)",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.DroughtIndicator, {
    name:"Drought Indicator",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateOranges).domain([1500, 0]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "5th percentile of annual runoff time series during the specific period",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.Groundwater, {
    name:"Groundwater",
    id: getClimateDataId,
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Minimum of the 12 monthly runoff climatology during the specific period (40 years or 20 years. To avoid negative values, the minimum cutoff value is set to be 0.000001)",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.MaxTemperature, {
    name:"Maximum Month Temperature",
    id: getClimateDataId,
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Directly calculated from the reanalysis data",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.Evapotranspiration, {
    name:"Mean Annual Potential Evapotranspiration",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Monthly potential evapotranspiration is calculated based on monthly mean surface air temperature, monthly mean temperature diurnal range, and monthly mean precipitation using modified Hargreaves method (Droogers and Allen, Irrigation and Drainage Systems 16: 33–45, 2002)",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.Precipitation, {
    name: "Mean Annual Precipitation",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Directly calculated from the reanalysis data",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.Runoff, {
    name:"Mean Annual Runoff",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "Monthly runoff is calculated based on the monthly precipitation and potential evapotransipiration using the Turc-Pike model (Yates, Climate Research, Vol 9, 147-155, 1997)",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.FloodIndicator, {
    name:"Flood Indicator",
    id: getClimateDataId,
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalizations: rawAndStdDev,
    type: DataType.Climate,
    description: "98th percentile of monthly runoff time series during the specific period",
    years: years,
    datasets: climateDatasets
});
dataDefinitions.set(DataGroup.GDP2018, {
    name: "GDP 2018",
    id: getEconDataId,
    units: "USD",
    formatter: money,
    color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.AllIndustries, {
    name:"Employment in all industries 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.Farming, {
    name:"Employment in farming 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.Mining, {
    name:"Employment in mining 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.Construction, {
    name:"Employment in construction 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.Retail, {
    name:"Employment in retail trade 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.Information, {
    name:"Employment in information 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.Wholesale, {
    name:"Employment in wholesale trade 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.discuss, {
    name:"Discuss global warming at least occasionally",
    id: getEconDataId,
    units:"% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([20, 60]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.PerCapitapersonalincome2018, {
    name:"Per capita personal income 2018",
    id: getEconDataId,
    units:"USD",
    formatter: money,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.BEA]
});
dataDefinitions.set(DataGroup.PercentPopulationUnder18, {
    name: "Population Under 18",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 50]),
    normalizations: raw,
    type: DataType.Demographic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.PercentPopulationOver65, {
    name: "Population Over 65",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 50]),
    normalizations: raw,
    type: DataType.Demographic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.PercentNonwhite, {
    name: "Nonwhite",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 100]),
    normalizations: raw,
    type: DataType.Demographic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.PercentofPopulationBelowPovertyLevel, {
    name: "Population Below Poverty Level",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 50]),
    normalizations: raw,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});

dataDefinitions.set(DataGroup.PercentPopulationUnder18Std, {
    name: "Population Under 18",
    id: getEconDataId,
    units: "Standard deviations",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([4, 0, -4]),
    normalizations: stdDev,
    type: DataType.Demographic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.PercentPopulationOver65Std, {
    name: "Population Over 65",
    id: getEconDataId,
    units: "Standard deviations",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([4, 0, -4]),
    normalizations: stdDev,
    type: DataType.Demographic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.PercentNonwhiteStd, {
    name: "Nonwhite",
    id: getEconDataId,
    units: "Standard deviations",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([4, 0, -4]),
    normalizations: stdDev,
    type: DataType.Demographic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.PercentofPopulationBelowPovertyLevelStd, {
    name: "Population Below Poverty Level",
    id: getEconDataId,
    units: "Standard deviations",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([4, 0, -4]),
    normalizations: stdDev,
    type: DataType.Economic,
    description: "",
    years: [],
    datasets: [Dataset.Census]
});
dataDefinitions.set(DataGroup.discuss, {
    name: "Discuss global warming at least occasionally",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.reducetax, {
    name: "Support requiring fossil fuel companies to pay a carbon tax",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.CO2limits, {
    name: "Support setting strict CO2 limits on existing coal-fired power plants",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.localofficials, {
    name: "Agree that your local officials should do more to address global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.governor, {
    name: "Agree that your governor should do more to address global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.congress, {
    name: "Agree that congress should do more to address global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.president, {
    name: "Agree that the president should do more to address global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.corporations, {
    name: "Agree that corporations and industry should do more to address global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.citizens, {
    name: "Agree that citizens themselves should do more to address global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.regulate, {
    name: "Support regulating CO2 as a pollutant",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.supportRPS, {
    name: " Support requiring utilities to produce 20% electricity from renewable sources",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.drilloffshore, {
    name: "Support expanding offshore drilling for oil and natural gas off the U.S. coast",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.drillANWR, {
    name: "Support drilling for oil in the Arctic National Wildlife Refuge",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.fundrenewables, {
    name: "Support funding research into renewable energy sources",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.rebates, {
    name: "Support providing tax rebates",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.mediaweekly, {
    name: "Hear about global warming in the media at least once a week ",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.prienv, {
    name: "Agree that global warming should be a high priority for the next president and Congress",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.teachGW, {
    name: "Agree that schools should teach about global warming ",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.happening, {
    name: "Agree that global warming is happening",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.human, {
    name: "Agree that global warming is caused mostly by human activities",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.consensus, {
    name: "Agree that most scientists think global warming is happening",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.worried, {
    name: "Are worried about global warming",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.personal, {
    name: "Think that global warming will harm me personally",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.harmUS, {
    name: "Think that global warming is already harming people in the US",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.devharm, {
    name: "Think that global warming will harm people in developing countries",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.futuregen, {
    name: "Think that global warming will harm future generations",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.harmplants, {
    name: "Think that global warming will harm plants and animals ",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.timing, {
    name: "Think a candidate’s views on global warming are important to their vote",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});
dataDefinitions.set(DataGroup.affectweather, {
    name: "Think that global warming is affecting the weather in the United States",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([0, 50, 100]),
    normalizations: raw,
    type: DataType.ClimateSurvey,
    description: "",
    years: [],
    datasets: [Dataset.Yale]
});

export default dataDefinitions;
