// import React, { useEffect } from 'react';
// import { geoPath, geoMercator } from 'd3';

// const Marks = ({ data }) => {
//   useEffect(() => {
//     console.log('GeoJSON data:', data);
//   }, [data]);

//   // Manually set projection parameters
//   const projection = geoMercator()
//     .fitExtent([[0, 0], [width, height]], data); // Ensure the map fits within the SVG container

//   const path = geoPath(projection);

//   return (
//     <g>
//       {data.features.map((feature, i) => (
//         <path key={i} d={path(feature)} fill="lightblue" stroke="black" />
//       ))}
//     </g>
//   );
// };

// export default Marks;


import React, { useState } from 'react';
import { geoPath, geoNaturalEarth1 } from 'd3';

const Marks = ({ munich, rowByTerritory, colorScale, colorValue, onHover }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const projection = geoNaturalEarth1()
    .center([11.581981, 48.157125])
    .scale(150000)
    .translate([960 / 2, 500 / 2]);
  const path = geoPath(projection);

  return (
    <g className="marks">
      {munich.features.map((feature, i) => {
        const territoryName = feature.properties.Name;
        const row = rowByTerritory.get(territoryName);
        const value = row ? row.inhabitans_mean : 0;
        const inhabitants = row ? row.Inhabitans : 'Unknown';
        const inhabitantsPerInstitution = row ? row['Inhabitans Per Institution'] : 'Unknown';
        const amountofInstitutions = row ? row['Amout of Institutions'] : 'Unknown';
        
        const handleMouseEnter = () => {
          onHover({
            territory: territoryName,
            inhabitants,
            inhabitantsPerInstitution,
            amountofInstitutions
          });
          setHoveredDistrict(territoryName);
        };

        const handleMouseLeave = () => {
          onHover(null);
          setHoveredDistrict(null);
        };

        const isHovered = territoryName === hoveredDistrict;
        
        return (
          <path
            className={`map-path ${isHovered ? 'hovered' : ''}`}
            key={i}
            d={path(feature)}
            fill={colorScale(value)}
            stroke={isHovered ? 'red' : 'black'}
            strokeWidth={isHovered ? 2 : 1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <title>{territoryName}</title>
          </path>
        );
      })}
    </g>
  );
};

export default Marks;
