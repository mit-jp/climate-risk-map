import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential, format } from 'd3';
import { ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3-scale';

export enum DataName {
    cmi10_00_1,
    cmi10_80_9,
    cmi10_80_1,
    def_00_19,
    def_80_19,
    def_80_99,
    dry_00_19,
    dry_80_19,
    dry_80_99,
    gw_00_19,
    gw_80_19,
    gw_80_99,
    ht_00_19,
    ht_80_19,
    ht_80_99,
    pet_00_19,
    pet_80_19,
    pet_80_99,
    prc_00_19,
    prc_80_19,
    prc_80_99,
    ro_00_19,
    ro_80_19,
    ro_80_99,
    wet_00_19,
    wet_80_19,
    wet_80_99,
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
}

const regularNumber = format(",.0f");

const dataDefinitions = new Map<DataName, DataDefinition>();
dataDefinitions.set(DataName.cmi10_00_1, {
    name:"Climate Moisture Index 2000-2019",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10])
});
dataDefinitions.set(DataName.cmi10_80_9, {
    name:"Climate Moisture Index 1980-1999",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10])
});
dataDefinitions.set(DataName.cmi10_80_1, {
    name:"Climate Moisture Index 1980-2019",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10])
});
dataDefinitions.set(DataName.def_00_19, {
    name:"Irrigation Deficit 2000-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600])
});
dataDefinitions.set(DataName.def_80_19, {
    name:"Irrigation Deficit 1980-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600])
});
dataDefinitions.set(DataName.def_80_99, {
    name:"Irrigation Deficit 1980-1999",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600])
});
dataDefinitions.set(DataName.dry_00_19, {
    name:"Drought Indicator 2000-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500])
});
dataDefinitions.set(DataName.dry_80_19, {
    name:"Drought Indicator 1980-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500])
});
dataDefinitions.set(DataName.dry_80_99, {
    name:"Drought Indicator 1980-1999",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500])
});
dataDefinitions.set(DataName.gw_00_19, {
    name:"Groundwater 2000-2019",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40])
});
dataDefinitions.set(DataName.gw_80_19, {
    name:"Groundwater 1980-2019",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40])
});
dataDefinitions.set(DataName.gw_80_99, {
    name:"Groundwater 1980-1999",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40])
});
dataDefinitions.set(DataName.ht_00_19, {
    name:"Maximum Month Temperature 2000-2019",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40])
});
dataDefinitions.set(DataName.ht_80_19, {
    name:"Maximum Month Temperature 1980-2019",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40])
});
dataDefinitions.set(DataName.ht_80_99, {
    name:"Maximum Month Temperature 1980-1999",
    units:"°C",
    formatter: regularNumber,
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40])
});
dataDefinitions.set(DataName.pet_00_19, {
    name:"Mean Annual Potential Evapotranspiration 2000-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700])
});
dataDefinitions.set(DataName.pet_80_19, {
    name:"Mean Annual Potential Evapotranspiration 1980-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700])
});
dataDefinitions.set(DataName.pet_80_99, {
    name:"Mean Annual Potential Evapotranspiration 1980-1999",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700])
});
dataDefinitions.set(DataName.prc_00_19, {
    name: "Mean Annual Precipitation 2000-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200])
});
dataDefinitions.set(DataName.prc_80_19, {
    name:"Mean Annual Precipitation 1980-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200])
});
dataDefinitions.set(DataName.prc_80_99, {
    name:"Mean Annual Precipitation 1980-1999",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200])
});
dataDefinitions.set(DataName.ro_00_19, {
    name:"Mean Annual Runoff 2000-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000])
});
dataDefinitions.set(DataName.ro_80_19, {
    name:"Mean Annual Runoff 1980-2019",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000])
});
dataDefinitions.set(DataName.ro_80_99, {
    name:"Mean Annual Runoff 1980-1999",
    units:"mm/year",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000])
});
dataDefinitions.set(DataName.wet_00_19, {
    name:"Flood Indicator 2000-2019",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500])
});
dataDefinitions.set(DataName.wet_80_19, {
    name:"Flood Indicator 1980-2019",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500])
});
dataDefinitions.set(DataName.wet_80_99, {
    name:"Flood Indicator 1890-1999",
    units:"mm/month",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500])
});
dataDefinitions.set(DataName.GDP2018, {
    name: "GDP 2018",
    units: "USD",
    formatter: format("$,.0f"),
    color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8])
});
dataDefinitions.set(DataName.Allindustr, {
    name:"Allindustr",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000])
});
dataDefinitions.set(DataName.Farming, {
    name:"Farming",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataDefinitions.set(DataName.Mining, {
    name:"Mining",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataDefinitions.set(DataName.Constructi, {
    name:"Constructi",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataDefinitions.set(DataName.Retailtrad, {
    name:"Retailtrad",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataDefinitions.set(DataName.Informatio, {
    name:"Informatio",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataDefinitions.set(DataName.Wholesalet, {
    name:"Wholesalet",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataDefinitions.set(DataName.discuss, {
    name:"discuss",
    units:"",
    formatter: regularNumber,
    color: scaleSequential<string>(scales.interpolateGreens).domain([20, 60])
});
dataDefinitions.set(DataName.PerCapitap, {
    name:"PerCapitap",
    units:"",
    formatter: regularNumber,
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000])
});

export default dataDefinitions;