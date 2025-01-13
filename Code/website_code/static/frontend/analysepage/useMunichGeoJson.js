import React, { useState, useEffect } from 'react';
import { json } from 'd3';

const jsonUrl = 'https://gist.githubusercontent.com/getintogit1/b265ed7b70c6d4b332f04f028bff362a/raw/bfc71fc622c514d8af05089b2887f46f5ceed3b6/Munich.geojson'

export const useMunichGeoJson = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(jsonUrl).then(data => {
      setData(data);
    });
  }, []);

  return data;
};