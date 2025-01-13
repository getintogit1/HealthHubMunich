import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'App',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      d3: 'd3',
      topojson: 'topojson',
      'react-bootstrap':'ReactBootstrap'
    }
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react']
    })
  ],
  external: ['react', 'react-dom', 'd3', 'topojson', 'react-bootstrap']
};