import React from "react";

type Props = {
    color: string;
    d: string;
    id: string;
};

const CountyPath = ({ color, d }: Props) => {
    return <path
        fill={color}
        d={d}
    />
}

export default CountyPath;