import React from "react";
import { useSelector } from "react-redux";
import { clickCounty, hoverCounty } from "./appSlice";
import { useThunkDispatch } from "./Home";
import { RootState } from "./store";

type Props = {
    color: string;
    d: string;
    id: string;
};

const CountyPath = ({ color, d, id }: Props) => {
    const dispatch = useThunkDispatch();
    const isHovered = useSelector((state: RootState) => state.app.hoverCountyId === id);
    const setHoverCounty = () => dispatch(hoverCounty(id));
    const onClick = () => dispatch(clickCounty(id));
    return <path
        fill={color}
        d={d}
        onMouseOver={setHoverCounty}
        onTouchStart={setHoverCounty}
        onClick={onClick}
        opacity={isHovered ? 0.5 : 1}
        stroke={isHovered ? "black" : undefined}
        strokeWidth={isHovered ? 0.5 : undefined}
    />
}

export default CountyPath;