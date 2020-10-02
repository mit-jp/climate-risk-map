import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format } from 'd3';
import { ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3-scale';

export enum DataName {
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
dataDefinitions.set(DataName.Mcmi_00_19, {
    name:"Climate Moisture Index 2000-2019 MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.Ecmi_00_19, {
    name:"Climate Moisture Index 2000-2019 ERA5",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.Mcmi_80_99, {
    name:"Climate Moisture Index 1980-1999 MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.Ecmi_80_99, {
    name:"Climate Moisture Index 1980-1999 ERA5",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.Mcmi_80_19, {
    name:"Climate Moisture Index 1980-2019 MERRA2",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.Ecmi_80_19, {
    name:"Climate Moisture Index 1980-2019 ERA5",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10]),
    normalized: true,
    description: ""
});
dataDefinitions.set(DataName.Mdef_00_19, {
    name:"Irrigation Deficit 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Edef_00_19, {
    name:"Irrigation Deficit 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mdef_80_19, {
    name:"Irrigation Deficit 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Edef_80_19, {
    name:"Irrigation Deficit 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mdef_80_99, {
    name:"Irrigation Deficit 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Edef_80_99, {
    name:"Irrigation Deficit 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mdry_00_19, {
    name:"Drought Indicator 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Edry_00_19, {
    name:"Drought Indicator 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mdry_80_19, {
    name:"Drought Indicator 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Edry_80_19, {
    name:"Drought Indicator 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mdry_80_99, {
    name:"Drought Indicator 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Edry_80_99, {
    name:"Drought Indicator 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mgw_00_19, {
    name:"Groundwater 2000-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Egw_00_19, {
    name:"Groundwater 2000-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mgw_80_19, {
    name:"Groundwater 1980-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Egw_80_19, {
    name:"Groundwater 1980-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mgw_80_99, {
    name:"Groundwater 1980-1999 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Egw_80_99, {
    name:"Groundwater 1980-1999 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mht_00_19, {
    name:"Maximum Month Temperature 2000-2019 MERRA2",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Eht_00_19, {
    name:"Maximum Month Temperature 2000-2019 ERA5",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mht_80_19, {
    name:"Maximum Month Temperature 1980-2019 MERRA2",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Eht_80_19, {
    name:"Maximum Month Temperature 1980-2019 ERA5",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mht_80_99, {
    name:"Maximum Month Temperature 1980-1999 MERRA2",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Eht_80_99, {
    name:"Maximum Month Temperature 1980-1999 ERA5",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mpet_00_19, {
    name:"Mean Annual Potential Evapotranspiration 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Epet_00_19, {
    name:"Mean Annual Potential Evapotranspiration 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mpet_80_19, {
    name:"Mean Annual Potential Evapotranspiration 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Epet_80_19, {
    name:"Mean Annual Potential Evapotranspiration 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mpet_80_99, {
    name:"Mean Annual Potential Evapotranspiration 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Epet_80_99, {
    name:"Mean Annual Potential Evapotranspiration 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mprc_00_19, {
    name: "Mean Annual Precipitation 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Eprc_00_19, {
    name: "Mean Annual Precipitation 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mprc_80_19, {
    name:"Mean Annual Precipitation 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Eprc_80_19, {
    name:"Mean Annual Precipitation 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mprc_80_99, {
    name:"Mean Annual Precipitation 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Eprc_80_99, {
    name:"Mean Annual Precipitation 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mro_00_19, {
    name:"Mean Annual Runoff 2000-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Ero_00_19, {
    name:"Mean Annual Runoff 2000-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mro_80_19, {
    name:"Mean Annual Runoff 1980-2019 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Ero_80_19, {
    name:"Mean Annual Runoff 1980-2019 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mro_80_99, {
    name:"Mean Annual Runoff 1980-1999 MERRA2",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Ero_80_99, {
    name:"Mean Annual Runoff 1980-1999 ERA5",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mwet_00_19, {
    name:"Flood Indicator 2000-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Ewet_00_19, {
    name:"Flood Indicator 2000-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mwet_80_19, {
    name:"Flood Indicator 1980-2019 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Ewet_80_19, {
    name:"Flood Indicator 1980-2019 ERA5",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Mwet_80_99, {
    name:"Flood Indicator 1890-1999 MERRA2",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500]),
    normalized: false,
    description: ""
});
dataDefinitions.set(DataName.Ewet_80_99, {
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
    name:"Mining",
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