import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format } from 'd3';
import { ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3-scale';

export enum DataName {
    E_cmi10_00,
    E_cmi10_80,
    E_cmi10_81,
    E_def_00_1,
    E_def_80_1,
    E_def_80_9,
    E_dry_00_1,
    E_dry_80_1,
    E_dry_80_9,
    E_gw_00_19,
    E_gw_80_19,
    E_gw_80_99,
    E_ht_00_19,
    E_ht_80_19,
    E_ht_80_99,
    E_pet_00_1,
    E_pet_80_1,
    E_pet_80_9,
    E_prc_00_1,
    E_prc_80_1,
    E_prc_80_9,
    E_ro_00_19,
    E_ro_80_19,
    E_ro_80_99,
    E_wet_00_1,
    E_wet_80_1,
    E_wet_80_9,
    M_cmi10_00,
    M_cmi10_8_,
    M_cmi10_80,
    M_def_00_1,
    M_def_80_1,
    M_def_80_9,
    M_dry_00_1,
    M_dry_80_1,
    M_dry_80_9,
    M_gw_00_19,
    M_gw_80_19,
    M_gw_80_99,
    M_ht_00_19,
    M_ht_80_19,
    M_ht_80_99,
    M_pet_00_1,
    M_pet_80_1,
    M_pet_80_9,
    M_prc_00_1,
    M_prc_80_1,
    M_prc_80_9,
    M_ro_00_19,
    M_ro_80_19,
    M_ro_80_99,
    M_wet_00_1,
    M_wet_80_1,
    M_wet_80_9,
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
}

export type DataDefinition = {
    name: string,
    units: string,
    formatter: (n: number | { valueOf(): number }) => string,
    color: ScaleSequential<string> | ScaleThreshold<number, string> | ScaleDiverging<string>,
    normalized: boolean,
    description: string
}

const regularNumber = format(",.0f");

const dataDefinitions = new Map<DataName, DataDefinition>();
dataDefinitions.set(DataName.M_cmi10_00, {
    name:"Climate Moisture Index 2000-2019 MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.E_cmi10_00, {
    name:"Climate Moisture Index 2000-2019 ERA5",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.M_cmi10_80, {
    name:"Climate Moisture Index 1980-1999 MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.E_cmi10_80, {
    name:"Climate Moisture Index 1980-1999 ERA5",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.M_cmi10_8_, {
    name:"Climate Moisture Index 1980-2019 MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.E_cmi10_81, {
    name:"Climate Moisture Index 1980-2019 ERA5",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.M_def_00_1, {
    name:"Irrigation Deficit 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_def_00_1, {
    name:"Irrigation Deficit 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_def_80_1, {
    name:"Irrigation Deficit 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_def_80_1, {
    name:"Irrigation Deficit 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_def_80_9, {
    name:"Irrigation Deficit 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_def_80_9, {
    name:"Irrigation Deficit 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_dry_00_1, {
    name:"Drought Indicator 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_dry_00_1, {
    name:"Drought Indicator 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_dry_80_1, {
    name:"Drought Indicator 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_dry_80_1, {
    name:"Drought Indicator 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_dry_80_9, {
    name:"Drought Indicator 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_dry_80_9, {
    name:"Drought Indicator 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_gw_00_19, {
    name:"Groundwater 2000-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_gw_00_19, {
    name:"Groundwater 2000-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_gw_80_19, {
    name:"Groundwater 1980-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_gw_80_19, {
    name:"Groundwater 1980-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_gw_80_99, {
    name:"Groundwater 1980-1999 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_gw_80_99, {
    name:"Groundwater 1980-1999 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_ht_00_19, {
    name:"Maximum Month Temperature 2000-2019 MERRA2",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_ht_00_19, {
    name:"Maximum Month Temperature 2000-2019 ERA5",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_ht_80_19, {
    name:"Maximum Month Temperature 1980-2019 MERRA2",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_ht_80_19, {
    name:"Maximum Month Temperature 1980-2019 ERA5",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_ht_80_99, {
    name:"Maximum Month Temperature 1980-1999 MERRA2",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_ht_80_99, {
    name:"Maximum Month Temperature 1980-1999 ERA5",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_pet_00_1, {
    name:"Mean Annual Potential Evapotranspiration 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_pet_00_1, {
    name:"Mean Annual Potential Evapotranspiration 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_pet_80_1, {
    name:"Mean Annual Potential Evapotranspiration 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_pet_80_1, {
    name:"Mean Annual Potential Evapotranspiration 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_pet_80_9, {
    name:"Mean Annual Potential Evapotranspiration 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_pet_80_9, {
    name:"Mean Annual Potential Evapotranspiration 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_prc_00_1, {
    name: "Mean Annual Precipitation 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_prc_00_1, {
    name: "Mean Annual Precipitation 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_prc_80_1, {
    name:"Mean Annual Precipitation 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_prc_80_1, {
    name:"Mean Annual Precipitation 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_prc_80_9, {
    name:"Mean Annual Precipitation 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_prc_80_9, {
    name:"Mean Annual Precipitation 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_ro_00_19, {
    name:"Mean Annual Runoff 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_ro_00_19, {
    name:"Mean Annual Runoff 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_ro_80_19, {
    name:"Mean Annual Runoff 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_ro_80_19, {
    name:"Mean Annual Runoff 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_ro_80_99, {
    name:"Mean Annual Runoff 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_ro_80_99, {
    name:"Mean Annual Runoff 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_wet_00_1, {
    name:"Flood Indicator 2000-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_wet_00_1, {
    name:"Flood Indicator 2000-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_wet_80_1, {
    name:"Flood Indicator 1980-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_wet_80_1, {
    name:"Flood Indicator 1980-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.M_wet_80_9, {
    name:"Flood Indicator 1890-1999 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.E_wet_80_9, {
    name:"Flood Indicator 1890-1999 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.GDP2018, {
    name: "GDP 2018",
    units: "USD",
    formatter: format("$,.0f"),
    color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Allindustr, {
    name:"Allindustr",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Farming, {
    name:"Farming",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mining, {
    name:"Mining MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Constructi, {
    name:"Constructi",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Retailtrad, {
    name:"Retailtrad",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Informatio, {
    name:"Informatio",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Wholesalet, {
    name:"Wholesalet",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.discuss, {
    name:"discuss",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([20, 60]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.PerCapitap, {
    name:"PerCapitap",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000]),
    normalized: false,
    description: ""
});

export default dataDefinitions;