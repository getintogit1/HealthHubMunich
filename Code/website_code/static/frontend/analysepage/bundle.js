(function (React$1, ReactDOM, d3, reactBootstrap) {
  'use strict';

  const jsonUrl = 'https://gist.githubusercontent.com/getintogit1/b265ed7b70c6d4b332f04f028bff362a/raw/bfc71fc622c514d8af05089b2887f46f5ceed3b6/Munich.geojson';
  const useMunichGeoJson = () => {
    const [data, setData] = React$1.useState(null);
    React$1.useEffect(() => {
      d3.json(jsonUrl).then(data => {
        setData(data);
      });
    }, []);
    return data;
  };

  // import React, { useEffect } from 'react';
  // import { geoPath, geoMercator } from 'd3';

  const Marks = ({
    munich,
    rowByTerritory,
    colorScale,
    colorValue,
    onHover
  }) => {
    const [hoveredDistrict, setHoveredDistrict] = React$1.useState(null);
    const projection = d3.geoNaturalEarth1().center([11.581981, 48.157125]).scale(150000).translate([960 / 2, 500 / 2]);
    const path = d3.geoPath(projection);
    return /*#__PURE__*/React$1.createElement("g", {
      className: "marks"
    }, munich.features.map((feature, i) => {
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
      return /*#__PURE__*/React$1.createElement("path", {
        className: `map-path ${isHovered ? 'hovered' : ''}`,
        key: i,
        d: path(feature),
        fill: colorScale(value),
        stroke: isHovered ? 'red' : 'black',
        strokeWidth: isHovered ? 2 : 1,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }, /*#__PURE__*/React$1.createElement("title", null, territoryName));
    }));
  };

  const Legend = ({
    colorScale,
    width = 300,
    height = 10,
    marginTop = 20,
    marginRight = 30
  }) => {
    const legendRef = React$1.useRef();
    React$1.useEffect(() => {
      if (legendRef.current) {
        const svg = d3.select(legendRef.current);
        svg.selectAll('*').remove(); // Clear previous elements

        const defs = svg.append('defs');
        const linearGradientId = 'linear-gradient';

        // Define the linear gradient
        const linearGradient = defs.append('linearGradient').attr('id', linearGradientId);
        const domain = colorScale.domain();
        const min = domain[0];
        const max = domain[domain.length - 1];

        //console.log("DOmain:", domain)

        linearGradient.selectAll('stop').data(colorScale.ticks().map(t => ({
          offset: `${100 * (t - min) / (max - min)}%`,
          color: colorScale(t)
        }))).enter().append('stop').attr('offset', d => d.offset).attr('stop-color', d => d.color);

        // Append the rectangle with gradient fill
        svg.append('rect').attr('width', width).attr('height', height).style('fill', `url(#${linearGradientId})`).attr('transform', `translate(${marginRight}, ${marginTop})`);

        // Create a scale for the x-axis
        const xScale = d3.scaleLinear().domain(domain).range([0, width]);
        const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(6);
        svg.append('g').attr('transform', `translate(${marginRight}, ${marginTop + height})`).call(xAxis).select('.domain').remove(); // Remove the axis line
      }
    }, [colorScale, width, height, marginTop, marginRight]);
    return /*#__PURE__*/React$1.createElement("svg", {
      ref: legendRef,
      width: width + marginRight * 2,
      height: height + marginTop * 2
    });
  };

  const csvUrl = 'https://gist.githubusercontent.com/getintogit1/90813b699157cd6d55b23707287e6eb5/raw/e7a0551c8db1f3227b301ed8523a356ed00e5341/Munich_HealthInstitutions.csv';
  const row = d => {
    return {
      Indicator: d.Indicator,
      Year: +d.Year,
      Territory: d.Territory,
      'Inhabitans Per Institution': +d['Inhabitans Per Institution'].replace(',', '.'),
      Inhabitans: +d.Inhabitans,
      'Amout of Institutions': +d['Amout of Institutions'],
      inhabitans_mean: +d['Inhabitans Per Institution'].replace(',', '.')
    };
  };
  const useData = () => {
    const [data, setData] = React$1.useState(null);
    React$1.useEffect(() => {
      d3.dsv(';', csvUrl, row).then(setData);
    }, []);
    return data;
  };

  //console.log(Dropdown)

  const MyDropdown = ({
    label,
    selectedValue,
    options,
    onSelectedValueChange
  }) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "menus-container"
    }, /*#__PURE__*/React.createElement("label", {
      className: "dropdown-label",
      htmlFor: "dropdown-basic"
    }, label), /*#__PURE__*/React.createElement(reactBootstrap.Dropdown, {
      className: "MyDropdown-root"
    }, /*#__PURE__*/React.createElement(reactBootstrap.Dropdown.Toggle, {
      className: "custom-dropdown-toggle"
    }, selectedValue), /*#__PURE__*/React.createElement(reactBootstrap.Dropdown.Menu, {
      className: "MyDropdown-menu"
    }, options.map(option => /*#__PURE__*/React.createElement(reactBootstrap.Dropdown.Item, {
      key: option.value,
      onClick: () => onSelectedValueChange(option.value)
    }, option.label)))));
  };

  const margin = {
    top: 70,
    right: 200,
    bottom: 70,
    left: 20
  };
  const width = 840;
  const height = 500;
  const attributes = [{
    value: "Apotheken-Dichte insgesamt",
    label: "Apotheken"
  }, {
    value: "Arzt*aerztin-Dichte Allgemeinmedizin",
    label: "Allgemeinmedizin"
  }, {
    value: "Arzt*aerztin-Dichte Frauenheilkunde und Geburtshilfe",
    label: "Frauenheilkunde und Geburtshilfe"
  }, {
    value: "Arzt*aerztin-Dichte Innere Medizin",
    label: "Ärzte der Inneren Medizin"
  }, {
    value: "Arzt*aerztin-Dichte insgesamt",
    label: "Ärzte Dichte Insgesamt"
  }, {
    value: "Arzt*aerztin-Dichte Kinder- und Jugendmedizin",
    label: "Kinder- und Jugendmedizin"
  }, {
    value: "Arzt*aerztin-Dichte Orthopaedie",
    label: "Orthopäden Dichte"
  }, {
    value: "Psychologische*r Psychotherapeut*in-Dichte",
    label: "Psychotherapeuten"
  }, {
    value: "Zahnarzt*Zahnaerztin-Dichte",
    label: "Zahnarzt"
  }];
  const getLabel = value => {
    const attribute = attributes.find(attr => attr.value === value);
    return attribute ? attribute.label : 'Unknown';
  };
  const App = () => {
    const munich = useMunichGeoJson();
    const data = useData();
    const initialAttribute = 'Apotheken-Dichte insgesamt';
    const [selectedYear, setSelectedYear] = React$1.useState(2022);
    const [attribute, setAttribute] = React$1.useState(initialAttribute);
    const [hoveredTerritory, setHoveredTerritory] = React$1.useState(null);
    const label = getLabel(attribute);
    if (!munich || !data) {
      return /*#__PURE__*/React$1.createElement("pre", null, "Loading...");
    }
    const filteredData = data.filter(d => d.Year === selectedYear && d.Indicator === attribute && d.Territory !== "Stadt Muenchen");
    //console.log(filteredData)

    const rowByTerritory = new Map();
    filteredData.forEach(d => {
      rowByTerritory.set(d.Territory, d);
    });
    const colorValue = d => d.inhabitans_mean;
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(filteredData, colorValue)]);
    return /*#__PURE__*/React$1.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/React$1.createElement("div", {
      style: {
        marginLeft: margin.left,
        marginTop: margin.top
      }
    }, /*#__PURE__*/React$1.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React$1.createElement("text", {
      className: "Title",
      textAnchor: "middle"
    }, label, "  im Jahr: ", selectedYear)), /*#__PURE__*/React$1.createElement("g", {
      style: {
        height: 'auto',
        width: 'auto%'
      }
    }, /*#__PURE__*/React$1.createElement("text", {
      className: "Title"
    }, "Anzahl Bewohner pro Einrichtung:"), /*#__PURE__*/React$1.createElement(Legend, {
      colorScale: colorScale
    })), /*#__PURE__*/React$1.createElement("div", {
      className: "menu-container"
    }, /*#__PURE__*/React$1.createElement(MyDropdown, {
      label: "",
      selectedValue: attribute,
      options: attributes,
      onSelectedValueChange: setAttribute
    })), /*#__PURE__*/React$1.createElement("svg", {
      className: "custom-svg",
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "xMidYMid meet"
    }, /*#__PURE__*/React$1.createElement(Marks, {
      munich: munich,
      rowByTerritory: rowByTerritory,
      colorScale: colorScale,
      colorValue: colorValue,
      onHover: setHoveredTerritory
    })), /*#__PURE__*/React$1.createElement("div", {
      className: "slidecontainer"
    }, /*#__PURE__*/React$1.createElement("span", {
      className: "label"
    }, "2010"), /*#__PURE__*/React$1.createElement("input", {
      type: "range",
      min: "2010",
      max: "2022",
      value: selectedYear,
      onChange: e => setSelectedYear(parseInt(e.target.value)),
      className: "slider",
      id: "myRange",
      style: {
        width: '80%',
        margin: '0 auto',
        border: 'solid 4px'
      }
    }), /*#__PURE__*/React$1.createElement("span", {
      className: "label"
    }, "2022")), hoveredTerritory && /*#__PURE__*/React$1.createElement("div", {
      className: "hover-info"
    }, /*#__PURE__*/React$1.createElement("h3", null, "Stadtteil: ", hoveredTerritory.territory), /*#__PURE__*/React$1.createElement("p", null, "Bewohner: ", hoveredTerritory.inhabitants), /*#__PURE__*/React$1.createElement("p", null, "Bewohner pro Einrichtung: ", hoveredTerritory.inhabitantsPerInstitution), /*#__PURE__*/React$1.createElement("p", null, "Anzahl an Einrichtungen: ", hoveredTerritory.amountofInstitutions))));
  };
  const rootElement = document.getElementById('analyse');
  ReactDOM.render( /*#__PURE__*/React$1.createElement(App, null), rootElement);

})(React, ReactDOM, d3, ReactBootstrap);
