import { useState, useEffect } from 'react';
import { csv,dsv } from 'd3';

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

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dsv(';', csvUrl, row).then(setData);
  }, []);

  return data;
};

