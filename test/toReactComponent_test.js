const toReact = require('../');
const test = require('tap').test;
const fs = require('fs');

test('it converts svg files', (t) => {
  const svg = fs.readFileSync(__dirname + '/files/svg-file.svg');
  return t.resolves(toReact(svg.toString()));
});

test('provides a default name for the component', (t) => {
  toReact('<svg><circle></circle></svg>').then((c) => {
    t.match(c.code, /function Svg\(props\)/);
    t.match(c.code, /Svg\.propTypes/);
    t.end();
  });
});

test('it uses the provided name to name the component', (t) => {
  toReact('<svg><circle></circle></svg>', 'my-icon').then((c) => {
    t.match(c.code, /function MyIconSvg\(props\)/);
    t.match(c.code, /MyIconSvg\.propTypes/);
    t.end();
  });
});
