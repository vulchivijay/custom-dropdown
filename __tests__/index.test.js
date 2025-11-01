const path = require('path');

test('built CJS bundle exports createDropdown', () => {
  const built = path.resolve(__dirname, '..', 'dist', 'index.cjs.js');
  const pkg = require(built);
  expect(typeof pkg.createDropdown === 'function' || typeof pkg.default === 'function').toBe(true);
});
