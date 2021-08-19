import React from "react";
import { useSelector } from "react-redux";
import { hoverCounty } from "./appSlice";
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
    return <path
        fill={color}
        d={d}
        onMouseMove={event =>
            dispatch(hoverCounty({
                countyId: id,
                position: { x: event.pageX + 10, y: event.pageY - 25 },
            }))}
        opacity={isHovered ? 0.5 : 1}
        stroke={isHovered ? "black" : undefined}
        strokeWidth={isHovered ? 0.5 : undefined}
    />
}

export default CountyPath;