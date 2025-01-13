import React, { useEffect, useRef } from 'react';
import { scaleLinear, axisBottom, select } from 'd3';

const Legend = ({ colorScale, width = 300, height = 10, marginTop = 20, marginRight = 30 }) => {
  const legendRef = useRef();

  useEffect(() => {
    if (legendRef.current) {
      const svg = select(legendRef.current);
      svg.selectAll('*').remove(); // Clear previous elements

      const defs = svg.append('defs');
      const linearGradientId = 'linear-gradient';

      // Define the linear gradient
      const linearGradient = defs.append('linearGradient')
        .attr('id', linearGradientId);

      const domain = colorScale.domain();
      const min = domain[0];
      const max = domain[domain.length - 1];

      //console.log("DOmain:", domain)

      linearGradient.selectAll('stop')
        .data(colorScale.ticks().map(t => ({ offset: `${100 * (t - min) / (max - min)}%`, color: colorScale(t) })))
        .enter().append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

      // Append the rectangle with gradient fill
      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', `url(#${linearGradientId})`)
        .attr('transform', `translate(${marginRight}, ${marginTop})`);

      // Create a scale for the x-axis
      const xScale = scaleLinear()
        .domain(domain)
        .range([0, width]);

      const xAxis = axisBottom(xScale)
        .ticks(5)
        .tickSize(6);

      svg.append('g')
        .attr('transform', `translate(${marginRight}, ${marginTop + height})`)
        .call(xAxis)
        .select('.domain').remove(); // Remove the axis line
    }
  }, [colorScale, width, height, marginTop, marginRight]);

  return (
    <svg
      ref={legendRef}
      width={width + marginRight * 2}
      height={height + marginTop * 2}
    />
  );
};

export default Legend;