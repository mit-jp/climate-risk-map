import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { select } from 'd3';

function App() {
  const [data, setData] = useState([25, 1, 45, 60, 23, 40]);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => { // called when dom elements are rendered
    console.log(svgRef);
    const svg = select(svgRef.current);
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", value => value)
      .attr("cx", value => value * 2)
      .attr("cy", value => value * 2)
      .attr("stroke", "red");
  }, [data]);
  return <React.Fragment>
    <svg ref={svgRef} width="100%" height="100%"></svg>
    <br/>
    <button onClick={() => setData(data.map(value => value + 5))}>Update data</button>
    <button onClick={() => setData(data.filter(value => value < 35))}>Filter Data</button>
  </React.Fragment>;
}

export default App;
