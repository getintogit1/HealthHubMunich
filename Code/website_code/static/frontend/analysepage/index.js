import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useMunichGeoJson } from './useMunichGeoJson';
import Marks from './Marks';
import Legend from './Legend';
import { useData } from './useData';
import { interpolateBlues, scaleSequential, max, scaleOrdinal } from 'd3';
import { MyDropdown } from './Dropdown';

const margin = { top: 70, right: 200, bottom: 70, left: 20 };
const width = 840;
const height = 500;

const indicator_label = null;

const attributes = [
  { value: "Apotheken-Dichte insgesamt", label: "Apotheken" },
  { value: "Arzt*aerztin-Dichte Allgemeinmedizin", label: "Allgemeinmedizin" },
  { value: "Arzt*aerztin-Dichte Frauenheilkunde und Geburtshilfe", label: "Frauenheilkunde und Geburtshilfe" },
  { value: "Arzt*aerztin-Dichte Innere Medizin", label: "Ärzte der Inneren Medizin" },
  { value: "Arzt*aerztin-Dichte insgesamt", label: "Ärzte Dichte Insgesamt" },
  { value: "Arzt*aerztin-Dichte Kinder- und Jugendmedizin", label: "Kinder- und Jugendmedizin" },
  { value: "Arzt*aerztin-Dichte Orthopaedie", label: "Orthopäden Dichte" },
  { value: "Psychologische*r Psychotherapeut*in-Dichte", label: "Psychotherapeuten" },
  { value: "Zahnarzt*Zahnaerztin-Dichte", label: "Zahnarzt" }
];

const getLabel = value => {
  const attribute = attributes.find(attr => attr.value === value);
  return attribute ? attribute.label : 'Unknown';
  
};

const App = () => {
  const munich = useMunichGeoJson();
  const data = useData();

  const initialAttribute = 'Apotheken-Dichte insgesamt';
  const [selectedYear, setSelectedYear] = useState(2022);
  const [attribute, setAttribute] = useState(initialAttribute);
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const label = getLabel(attribute);
  const value = d => d[attribute];

  if (!munich || !data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const filteredData = data.filter(d => d.Year === selectedYear && d.Indicator === attribute && d.Territory !== "Stadt Muenchen");
  //console.log(filteredData)

  const rowByTerritory = new Map();
  filteredData.forEach(d => {
    rowByTerritory.set(d.Territory, d);
  });

  const colorValue = d => d.inhabitans_mean;
  const colorScale = scaleSequential(interpolateBlues).domain([
    0,
    max(filteredData, colorValue)
  ]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginLeft: margin.left, marginTop: margin.top }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <text className="Title" textAnchor="middle" >
            {label}  im Jahr: {selectedYear}
          </text>
        </div>


        <g style={{ height: 'auto', width: 'auto%' }}>
          <text className="Title" >Anzahl Bewohner pro Einrichtung:</text>
          <Legend colorScale={colorScale}  />
        </g>
        
        <div className="menu-container">
          <MyDropdown
            label=""
            selectedValue={attribute} 
            options={attributes} 
            onSelectedValueChange={setAttribute} 
          />
        </div>

        <svg
          className="custom-svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <Marks
            munich={munich}
            rowByTerritory={rowByTerritory}
            colorScale={colorScale}
            colorValue={colorValue}
            onHover={setHoveredTerritory}
          />
        </svg>
        
        <div className="slidecontainer">
          <span className="label">2010</span>
          <input
            type="range"
            min="2010"
            max="2022"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="slider"
            id="myRange"
            style={{ width: '80%', margin: '0 auto', border: 'solid 4px' }}
          />
          <span className="label">2022</span>
        </div>

        {hoveredTerritory && (
          <div className="hover-info">
            <h3>Stadtteil: {hoveredTerritory.territory}</h3>
            <p>Bewohner: {hoveredTerritory.inhabitants}</p>
            <p>Bewohner pro Einrichtung: {hoveredTerritory.inhabitantsPerInstitution}</p>
            <p>Anzahl an Einrichtungen: {hoveredTerritory.amountofInstitutions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const rootElement = document.getElementById('analyse');
ReactDOM.render(<App />, rootElement);
