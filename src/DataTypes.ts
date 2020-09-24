import * as scales from 'd3-scale-chromatic';
import { scaleThreshold, scaleDiverging, scaleSequential } from 'd3';
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

export type Data = {
    name: string,
    units: string,
    formatter: (value: number) => string,
    color: ScaleSequential<string> | ScaleThreshold<number, string> | ScaleDiverging<string>,
}

const regularNumber = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
});

const dataTypes = new Map<DataName, Data>();
dataTypes.set(DataName.cmi10_00_1, {
    name:"Climate Moisture Index 2000-2019",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10])
});
dataTypes.set(DataName.cmi10_80_9, {
    name:"Climate Moisture Index 1980-1999",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10])
});
dataTypes.set(DataName.cmi10_80_1, {
    name:"Climate Moisture Index 1980-2019",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([-10, 0, 10])
});
dataTypes.set(DataName.def_00_19, {
    name:"Irrigation Deficit 2000-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600])
});
dataTypes.set(DataName.def_80_19, {
    name:"Irrigation Deficit 1980-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600])
});
dataTypes.set(DataName.def_80_99, {
    name:"Irrigation Deficit 1980-1999",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(x => scales.interpolateBrBG(1-x)).domain([-600, 0, 1600])
});
dataTypes.set(DataName.dry_00_19, {
    name:"Drought Indicator 2000-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500])
});
dataTypes.set(DataName.dry_80_19, {
    name:"Drought Indicator 1980-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500])
});
dataTypes.set(DataName.dry_80_99, {
    name:"Drought Indicator 1980-1999",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 1500])
});
dataTypes.set(DataName.gw_00_19, {
    name:"Groundwater 2000-2019",
    units:"mm/month",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40])
});
dataTypes.set(DataName.gw_80_19, {
    name:"Groundwater 1980-2019",
    units:"mm/month",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40])
});
dataTypes.set(DataName.gw_80_99, {
    name:"Groundwater 1980-1999",
    units:"mm/month",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 40])
});
dataTypes.set(DataName.ht_00_19, {
    name:"Maximum Month Temperature 2000-2019",
    units:"°C",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40])
});
dataTypes.set(DataName.ht_80_19, {
    name:"Maximum Month Temperature 1980-2019",
    units:"°C",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40])
});
dataTypes.set(DataName.ht_80_99, {
    name:"Maximum Month Temperature 1980-1999",
    units:"°C",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(x => scales.interpolateSpectral(1 - x)).domain([20, 30, 40])
});
dataTypes.set(DataName.pet_00_19, {
    name:"Mean Annual Potential Evapotranspiration 2000-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700])
});
dataTypes.set(DataName.pet_80_19, {
    name:"Mean Annual Potential Evapotranspiration 1980-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700])
});
dataTypes.set(DataName.pet_80_99, {
    name:"Mean Annual Potential Evapotranspiration 1980-1999",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([300, 1700])
});
dataTypes.set(DataName.prc_00_19, {
    name: "Mean Annual Precipitation 2000-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200])
});
dataTypes.set(DataName.prc_80_19, {
    name:"Mean Annual Precipitation 1980-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200])
});
dataTypes.set(DataName.prc_80_99, {
    name:"Mean Annual Precipitation 1980-1999",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2200])
});
dataTypes.set(DataName.ro_00_19, {
    name:"Mean Annual Runoff 2000-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000])
});
dataTypes.set(DataName.ro_80_19, {
    name:"Mean Annual Runoff 1980-2019",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000])
});
dataTypes.set(DataName.ro_80_99, {
    name:"Mean Annual Runoff 1980-1999",
    units:"mm/year",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 2000])
});
dataTypes.set(DataName.wet_00_19, {
    name:"Flood Indicator 2000-2019",
    units:"mm/month",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500])
});
dataTypes.set(DataName.wet_80_19, {
    name:"Flood Indicator 1980-2019",
    units:"mm/month",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500])
});
dataTypes.set(DataName.wet_80_99, {
    name:"Flood Indicator 1890-1999",
    units:"mm/month",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateBlues).domain([0, 500])
});
dataTypes.set(DataName.GDP2018, {
    name: "GDP 2018",
    units: "USD",
    formatter: value => new Intl.NumberFormat(
        undefined,
        {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
    ).format(value),
    color: scaleThreshold<number, string>().domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]).range(scales.schemeGreens[8])
});
dataTypes.set(DataName.Allindustr, {
    name:"Allindustr",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 1000000])
});
dataTypes.set(DataName.Farming, {
    name:"Farming",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataTypes.set(DataName.Mining, {
    name:"Mining",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataTypes.set(DataName.Constructi, {
    name:"Constructi",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataTypes.set(DataName.Retailtrad, {
    name:"Retailtrad",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataTypes.set(DataName.Informatio, {
    name:"Informatio",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataTypes.set(DataName.Wholesalet, {
    name:"Wholesalet",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([0, 20000])
});
dataTypes.set(DataName.discuss, {
    name:"discuss",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleSequential<string>(scales.interpolateGreens).domain([20, 60])
});
dataTypes.set(DataName.PerCapitap, {
    name:"PerCapitap",
    units:"",
    formatter: value => regularNumber.format(value),
    color: scaleDiverging<string>(scales.interpolateBrBG).domain([10000, 40000, 100000])
});

export default dataTypes;