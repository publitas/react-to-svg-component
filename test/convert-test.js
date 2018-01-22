const toReact = require('../');
const test = require('tap').test;
const tapromise = require('tapromise');

function testPromise(dec, f) {
  return test(dec, t => f(tapromise(t)));
}

testPromise('it removes hard coded stroke colors', t => {
  return t.match(
    toReact('<svg><circle stroke="#979797"></circle></svg>'),
    /React.createElement\("circle", { stroke: evalColor\("stroke", "#979797"\) }\)/
  );
});

testPromise('it removes hard coded fill colors', t => {
  return t.match(
    toReact('<svg><circle fill="#979797"></circle></svg>'),
    /React.createElement\("circle", { fill: evalColor\("fill", "#979797"\) }\)/
  );
});

testPromise('convert removes hard coded dimensions', t => {
  return t.match(
    toReact('<svg><circle width="2" height="3"></circle></svg>'),
    /React.createElement\("circle", null\)/
  );
});

testPromise('it camelizes props', t => {
  return t.match(
    toReact('<svg><circle fill-rule="even"></circle></svg>'),
    /React.createElement\("circle", { fillRule: "even" }\)/
  );
});


