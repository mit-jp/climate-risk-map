export type WaterwayValue = "total" | "coalpetro" | "foodfarm" | "crudemat" | "chem" | "manu" | "other";
type WaterwayType = {
    name: string,
    value: WaterwayValue,
}
const waterwayTypes: WaterwayType[] = [
    { name: "Total", value: "total" },
    { name: "Coal & Petro", value: "coalpetro" },
    { name: "Food", value: "foodfarm" },
    { name: "Crude Materials", value: "crudemat" },
    { name: "Chemical", value: "chem" },
    { name: "Manufacturing", value: "manu" },
    { name: "Other", value: "other" },
];

export default waterwayTypes;