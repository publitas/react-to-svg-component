const toJsx = require('../src/svgToJsx.js');
const test = require('tap').test;
const tapromise = require('tapromise');
const fs = require('fs');
const {transformFromAst} = require('babel-core');

function testPromise(dec, f) {
  return test(dec, t => f(tapromise(t)));
}

test('it does stuff', t => {
  const svg = fs.readFileSync(__dirname + '/files/svg-file.svg');
  toJsx(svg.toString()).then(c => {
    console.log(transformFromAst(c, true).code);
    t.end();
  });
});

// testPromise('it removes hard coded fill colors', t => {
//   return t.match(
//     toReact('<svg><circle fill="#979797"></circle></svg>'),
//     /React.createElement\("circle", { fill: evalColor\("fill", "#979797"\) }\)/
//   );
// });

// testPromise('convert removes hard coded dimensions', t => {
//   return t.match(
//     toReact('<svg><circle width="2" height="3"></circle></svg>'),
//     /React.createElement\("circle", null\)/
//   );
// });

// testPromise('it camelizes props', t => {
//   return t.match(
//     toReact('<svg><circle fill-rule="even"></circle></svg>'),
//     /React.createElement\("circle", { fillRule: "even" }\)/
//   );
// });


