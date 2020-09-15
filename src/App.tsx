import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { select, line, curveCardinal } from 'd3';

function App() {
  const [data, setData] = useState<[number, number][]>([[0,25], [1,1], [4,45], [5,60], [7,23], [8,40]]);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => { // called when dom elements are rendered
    console.log(svgRef);
    const svg = select(svgRef.current);
    const myLine = line()
      .x(datum => datum[0] * 50)
      .y(datum => datum[1])
      .curve(curveCardinal);
    svg.selectAll("path")
      .data([data])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, [data]);
  return <React.Fragment>
    <svg ref={svgRef} width="100%" height="100%"></svg>
    <br/>
  </React.Fragment>;
}

export default App;
