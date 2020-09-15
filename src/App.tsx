import React, { useRef, useEffect, useState } from 'react';
import { feature } from 'topojson-client';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { json } from 'd3-fetch';
import { select } from 'd3';

function App() {
  const [data, setData] = useState(null);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.attr("viewBox", "0, 0, 960, 960");
    const test = json<Topology<Objects<GeoJsonProperties>>>("usa-topo.json").then(data => {
      console.log(data);
      console.log(feature(data, data.objects.counties))
    });
    console.log(test);
  }, [data]);
  return <React.Fragment>
    <svg ref={svgRef}></svg>
    <br/>
  </React.Fragment>;
}

export default App;
