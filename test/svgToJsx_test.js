const toJsx = require('../src/svgToJsx.js');
const test = require('tap').test;
const {transformFromAst} = require('babel-core');

const toJSXString = (svgString) =>
  transformFromAst(toJsx(svgString), true).code;

test('it removes hard coded fill colors', (t) => {
  t.equal(
    toJSXString('<svg><circle fill="#979797"></circle></svg>'),
    "<svg {...svgProps}><circle fill={evalColor('fill', '#979797', props.color)} /></svg>;",
  );
  t.end();
});

test('it leaves the viewBox intact', (t) => {
  t.equal(
    toJSXString(
      '<svg viewBox="0 0 16 16" width="16px" height="16px"><circle></circle></svg>',
    ),
    '<svg viewBox="0 0 16 16" {...svgProps}><circle /></svg>;',
  );
  t.end();
});

test('convert removes hard coded dimensions', (t) => {
  t.equal(
    toJSXString('<svg><circle width="2" height="3"></circle></svg>'),
    '<svg {...svgProps}><circle /></svg>;',
  );

  t.equal(
    toJSXString('<svg width="2" height="3" foo="bar"><circle></circle></svg>'),
    '<svg {...svgProps}><circle /></svg>;',
  );
  t.end();
});

test('it camelizes props', (t) => {
  t.equal(
    toJSXString('<svg><circle fill-rule="even"></circle></svg>'),
    '<svg {...svgProps}><circle fillRule="even" /></svg>;',
  );
  t.end();
});
