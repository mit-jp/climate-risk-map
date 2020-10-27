import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format } from 'd3';
import { ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3-scale';

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
    AllIndustries = "Allindustr",
    Farming = "Farming",
    Mining = "Mining",
    Construction = "Constructi",
    Retail = "Retailtrad",
    Information = "Informatio",
    Wholesale = "Wholesalet",
    discuss = "discuss",
    PerCapitap = "PerCapitap",
    GDP2018 = "GDP2018",
    PercentPop = "PercentPop",
    PercentP_1 = "PercentP_1",
    PercentNon = "PercentNon",
    PercentofP = "PercentofP",
    PercentP_2 = "PercentP_2",
    PercentP_3 = "PercentP_3",
    PercentN_1 = "PercentN_1",
    Percento_1 = "Percento_1",
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
    Allindustr,
    Farming,
    Mining,
    Constructi,
    Retailtrad,
    Informatio,
    Wholesalet,
    discuss,
    PerCapitap,
    GDP2018,
    PercentPop,
    PercentP_1,
    PercentNon,
    PercentofP,
    PercentP_2,
    PercentP_3,
    PercentN_1,
    Percento_1,
}

export type DataIdParams = {
    year?: Year,
    dataset?: Dataset,
    dataGroup: DataGroup
};

export type DataDefinition = {
    name: string,
    id: (params: DataIdParams) => DataId
    units: string,
    formatter: (n: number | { valueOf(): number }) => string,
    color: ScaleSequential<string> | ScaleThreshold<number, string> | ScaleDiverging<string>,
    normalized: boolean,
    description: string,
    years: Year[],
    datasets: Dataset[]
}

export enum Dataset {
    MERRA2 = "M",
    ERA5 = "E",
    NARR = "N"
}

export enum Year {
    _1980_1999 = "80_99",
    _2000_2019 = "00_19",
    _1980_2019 = "80_19"
}

const regularNumber = format(",.0f");
const years = [Year._1980_1999, Year._2000_2019, Year._1980_2019];
const datasets = [Dataset.ERA5, Dataset.MERRA2, Dataset.NARR];
const getClimateDataId = (params: DataIdParams) => {
    let dataIdString: string = params.dataGroup as string;
    dataIdString = params.dataset + dataIdString + "_" + params.year;
    return DataId[dataIdString as keyof typeof DataId];
};
const getEconDataId = (params: DataIdParams) => 
    DataId[params.dataGroup as keyof typeof DataId];

const dataDefinitions = new Map<DataGroup, DataDefinition>();
dataDefinitions.set(DataGroup.ClimateMoistureIndex, {
    name:"Climate Moisture Index",
    id: getClimateDataId,
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: false,
    description: "Calculated from mean annual precipitation and potential evapotransipiration",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.IrregationDeficit, {
    name:"Irrigation Deficit",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: "Difference between mean annual potential evapotransipiration and precipitation (def = pet - prc)",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.DroughtIndicator, {
    name:"Drought Indicator",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateOranges).domain([1500, 0]),
    normalized: false,
    description: "5th percentile of annual runoff time series during the specific period",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.Groundwater, {
    name:"Groundwater",
    id: getClimateDataId,
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: "Minimum of the 12 monthly runoff climatology during the specific period (40 years or 20 years. To avoid negative values, the minimum cutoff value is set to be 0.000001)",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.MaxTemperature, {
    name:"Maximum Month Temperature",
    id: getClimateDataId,
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: "Directly calculated from the reanalysis data",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.Evapotranspiration, {
    name:"Mean Annual Potential Evapotranspiration",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: "Monthly potential evapotranspiration is calculated based on monthly mean surface air temperature, monthly mean temperature diurnal range, and monthly mean precipitation using modified Hargreaves method (Droogers and Allen, Irrigation and Drainage Systems 16: 33–45, 2002)",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.Precipitation, {
    name: "Mean Annual Precipitation",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: "Directly calculated from the reanalysis data",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.Runoff, {
    name:"Mean Annual Runoff",
    id: getClimateDataId,
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: "Monthly runoff is calculated based on the monthly precipitation and potential evapotransipiration using the Turc-Pike model (Yates, Climate Research, Vol 9, 147-155, 1997)",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.FloodIndicator, {
    name:"Flood Indicator",
    id: getClimateDataId,
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: "98th percentile of monthly runoff time series during the specific period",
    years: years,
    datasets: datasets
});
dataDefinitions.set(DataGroup.GDP2018, {
    name: "GDP 2018",
    id: getEconDataId,
    units: "USD",
    formatter: format("$,.0f"),
    color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.AllIndustries, {
    name:"Employment in all industries 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Farming, {
    name:"Employment in farming 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Mining, {
    name:"Employment in mining 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Construction, {
    name:"Employment in construction 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Retail, {
    name:"Employment in retail trade 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Information, {
    name:"Employment in information 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Wholesale, {
    name:"Employment in wholesale trade 2007",
    id: getEconDataId,
    units:"people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.discuss, {
    name:"Discuss global warming at least occasionally",
    id: getEconDataId,
    units:"% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([20, 60]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PerCapitap, {
    name:"PerCapitap",
    id: getEconDataId,
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PercentPop, {
    name: "Population Under 18",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 50]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PercentP_1, {
    name: "Population Over 65",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 50]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PercentNon, {
    name: "Nonwhite",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 100]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PercentofP, {
    name: "Population Below Poverty Level",
    id: getEconDataId,
    units: "% of people",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolatePurples).domain([0, 50]),
    normalized: false,
    description: "",
    years: [],
    datasets: []
});

dataDefinitions.set(DataGroup.PercentP_2, {
    name: "Population Under 18",
    id: getEconDataId,
    units: "",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolatePRGn).domain([-4, 0, 4]),
    normalized: true,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PercentP_3, {
    name: "Population Over 65",
    id: getEconDataId,
    units: "",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolatePRGn).domain([-4, 0, 4]),
    normalized: true,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.PercentN_1, {
    name: "Nonwhite",
    id: getEconDataId,
    units: "",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolatePRGn).domain([-4, 0, 4]),
    normalized: true,
    description: "",
    years: [],
    datasets: []
});
dataDefinitions.set(DataGroup.Percento_1, {
    name: "of Population Below Poverty Level",
    id: getEconDataId,
    units: "",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolatePRGn).domain([-4, 0, 4]),
    normalized: true,
    description: "",
    years: [],
    datasets: []
});

export default dataDefinitions;
