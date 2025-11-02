import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  // ESM build
  {
    input: 'src/index.ts', // or your actual entry file
    output: {
      file: 'dist/bundle.js',
      format: 'esm', // or 'cjs', 'iife', etc for CommonJS
      sourcemap: true
    },
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()]
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })]
  }
];
